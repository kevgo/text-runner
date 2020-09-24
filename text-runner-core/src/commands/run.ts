import * as activities from "../activities/index"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import * as parser from "../parsers"
import * as runners from "../runners"
import * as workspace from "../workspace"
import * as actions from "../actions"
import * as events from "../events"
import * as command from "./index"
import * as configuration from "../configuration/index"
import { EventEmitter } from "events"

/** executes "text-run run", prints everything, returns the number of errors encountered */
export class Run implements command.Command {
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

      // step 2: create workspace
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
      const linkTargets = findLinkTargets(ASTs)

      // step 6: find actions
      const actionFinder = actions.Finder.load(config.sourceDir)

      // step 7: extract activities
      const dynamicActivities = activities.extractActivities(ASTs, config.regionMarker)
      const links = activities.extractImagesAndLinks(ASTs)
      if (dynamicActivities.length + links.length === 0) {
        const warnArgs: events.WarnArgs = { message: "no activities found" }
        this.emit("warning", warnArgs)
        return
      }

      // step 8: execute the ActivityList
      const startArgs: events.StartArgs = { stepCount: dynamicActivities.length + links.length }
      this.emit("start", startArgs)
      process.chdir(config.workspace)
      // kick off the parallel jobs to run in the background
      const parJobs = runners.parallel(links, actionFinder, linkTargets, config, this)
      // execute the serial jobs
      await runners.sequential(dynamicActivities, actionFinder, config, linkTargets, this)
      await Promise.all(parJobs)

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
