import { EventEmitter } from "events"

import * as actions from "../actions/index.js"
import * as activities from "../activities/index.js"
import * as configuration from "../configuration/index.js"
import * as events from "../events/index.js"
import * as files from "../filesystem/index.js"
import * as linkTargets from "../link-targets/index.js"
import * as parser from "../parsers/index.js"
import * as run from "../run/index.js"
import * as workspace from "../workspace/index.js"
import * as command from "./index.js"

/** executes "text-runner run", prints everything, returns the number of errors encountered */
export class Run implements command.Command {
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

      // step 2: create workspace
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

      // step 6: find actions
      const actionFinder = await actions.Finder.load(config.sourceDir)

      // step 7: extract activities
      const dynamicActivities = activities.extractDynamic(ASTs, config.regionMarker)
      const links = activities.extractImagesAndLinks(ASTs)
      if (dynamicActivities.length + links.length === 0) {
        this.emit("result", { message: "no activities found", status: "warning" })
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
