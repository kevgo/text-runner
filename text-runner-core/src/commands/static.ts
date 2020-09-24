import { extractImagesAndLinks } from "../activities/extract-images-and-links"
import { getFileNames } from "../filesystem/get-filenames"
import * as linkTargets from "../link-targets"
import * as parser from "../parsers"
import * as run from "../run"
import * as workspace from "../workspace"
import * as actions from "../actions"
import { Command } from "./command"
import * as events from "../events/index"
import * as configuration from "../configuration/index"
import { EventEmitter } from "events"

export class Static implements Command {
  userConfig: configuration.PartialData
  emitter: EventEmitter

  constructor(userConfig: configuration.PartialData) {
    this.userConfig = userConfig
    this.emitter = new EventEmitter()
  }

  emit(name: events.CommandEvent, payload: events.Args): void {
    this.emitter.emit(name, payload)
  }

  async execute(): Promise<void> {
    const originalDir = process.cwd()
    try {
      // step 1: determine full configuration
      const config = configuration.backfillDefaults(this.userConfig)

      // step 2: create working dir
      if (!config.workspace) {
        config.workspace = await workspace.create(config)
      }

      // step 3: find files
      const filenames = await getFileNames(config)
      if (filenames.length === 0) {
        const warnArgs: events.WarnArgs = { message: "no Markdown files found" }
        this.emit("warning", warnArgs)
        return
      }

      // step 4: read and parse files
      const ASTs = await parser.markdown.parse(filenames, config.sourceDir)

      // step 5: find link targets
      const targets = linkTargets.find(ASTs)

      // step 6: extract activities
      const links = extractImagesAndLinks(ASTs)
      if (links.length === 0) {
        const warnArgs: events.WarnArgs = { message: "no activities found" }
        this.emit("warning", warnArgs)
        return
      }

      // step 7: find actions
      const actionFinder = actions.Finder.loadStatic()

      // step 8: execute the ActivityList
      const startArgs: events.StartArgs = { stepCount: links.length }
      this.emit("start", startArgs)
      process.chdir(config.workspace)
      const parResults = run.parallel(links, actionFinder, targets, config, this)
      await Promise.all(parResults)

      // step 9: cleanup
      process.chdir(config.sourceDir)
    } finally {
      process.chdir(originalDir)
    }
  }

  on(name: events.CommandEvent, handler: events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
