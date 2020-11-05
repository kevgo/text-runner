import { EventEmitter } from "events"

import * as actions from "../actions"
import * as activities from "../activities/index"
import * as configuration from "../configuration/index"
import * as events from "../events"
import * as files from "../filesystem/index"
import * as linkTargets from "../link-targets"
import * as parser from "../parsers"
import * as run from "../run"
import * as workspace from "../workspace"
import * as command from "./index"

/** executes "text-run run", prints everything, returns the number of errors encountered */
export class Run implements command.Command {
  userConfig: configuration.APIData
  emitter: EventEmitter

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

      // step 2: create workspace
      await workspace.create(config)

      // step 3: find files
      const filenames = await files.getFileNames(config)
      if (filenames.length === 0) {
        this.emit("result", { status: "warning", message: "no Markdown files found" })
        return
      }

      // step 4: read and parse files
      const ASTs = await parser.markdown.parse(filenames, config.sourceDir)

      // step 5: find link targets
      const targets = linkTargets.find(ASTs)

      // step 6: find actions
      const actionFinder = await actions.Finder.load(config.sourceDir)

      // step 7: extract activities
      const dynamicActivities = activities.extractDynamic(ASTs, config.regionMarker)
      const links = activities.extractImagesAndLinks(ASTs)
      if (dynamicActivities.length + links.length === 0) {
        this.emit("result", { status: "warning", message: "no activities found" })
        return
      }

      // step 8: execute the ActivityList
      const startArgs: events.Start = { stepCount: dynamicActivities.length + links.length }
      this.emit("start", startArgs)
      process.chdir(config.workspace.platformified())
      // kick off the parallel jobs to run in the background
      const parJobs = run.parallel(links, actionFinder, targets, config, this)
      // execute the serial jobs
      await run.sequential(dynamicActivities, actionFinder, config, targets, this)
      await Promise.all(parJobs)

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
