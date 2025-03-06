import { EventEmitter } from "events"

import * as actions from "../actions/index.js"
import { extractImagesAndLinks } from "../activities/extract-images-and-links.js"
import * as configuration from "../configuration/index.js"
import * as events from "../events/index.js"
import * as files from "../filesystem/index.js"
import * as linkTargets from "../link-targets/index.js"
import * as parser from "../parsers/index.js"
import * as run from "../run/index.js"
import * as workspace from "../workspace/index.js"
import { Command } from "./command.js"

export class Static implements Command {
  emitter: EventEmitter
  userConfig: configuration.APIData

  constructor(userConfig: configuration.APIData) {
    this.userConfig = userConfig
    this.emitter = new EventEmitter()
  }

  emit(name: events.Name, payload: events.Args): void {
    this.emitter.emit(name, payload)
  }

  async execute(): Promise<void> {
    const originalDir = process.cwd()
    try {
      // step 1: determine full configuration
      const config = await configuration.addDefaults(this.userConfig)

      // step 2: create working dir
      await workspace.create(config)

      // step 3: find files
      const filenames = await files.getFileNames(config)
      if (filenames.length === 0) {
        this.emit("result", { message: "no Markdown files found", status: "warning" })
        return
      }

      // step 4: read and parse files
      const ASTs = await parser.markdown.parse(filenames, config.sourceDir)

      // step 5: find link targets
      const targets = linkTargets.find(ASTs)

      // step 6: extract activities
      const links = extractImagesAndLinks(ASTs)
      if (links.length === 0) {
        this.emit("result", { message: "no activities found", status: "warning" })
        return
      }

      // step 7: find actions
      const actionFinder = await actions.Finder.loadStatic()

      // step 8: execute the ActivityList
      this.emit("start", { stepCount: links.length } as events.Start)
      process.chdir(config.workspace.platformified())
      const parResults = run.parallel(links, actionFinder, targets, config, this)
      await Promise.all(parResults)

      // step 9: cleanup
      process.chdir(config.sourceDir.platformified())
    } finally {
      process.chdir(originalDir)
    }
  }

  on(name: events.Name, handler: events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
