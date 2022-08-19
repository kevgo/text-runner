import { EventEmitter } from "events"

import * as actions from "../actions/index.js"
import * as activities from "../activities/index.js"
import * as configuration from "../configuration/index.js"
import * as events from "../events/index.js"
import * as files from "../filesystem/index.js"
import * as linkTargets from "../link-targets/index.js"
import * as parsers from "../parsers/index.js"
import * as run from "../run/index.js"
import * as workspace from "../workspace/index.js"
import { Command } from "./command.js"

export class Dynamic implements Command {
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

      // step 2: create working dir
      await workspace.create(config)

      // step 3: find files
      const filenames = await files.getFileNames(config)
      if (filenames.length === 0) {
        this.emit("result", { status: "warning", message: "no Markdown files found" })
        return
      }

      // step 4: read and parse files
      const ASTs = await parsers.markdown.parse(filenames, config.sourceDir)

      // step 5: find link targets
      const targets = linkTargets.find(ASTs)

      // step 6: extract activities
      const dynamicActivities = activities.extractDynamic(ASTs, config.regionMarker)
      if (dynamicActivities.length === 0) {
        this.emit("result", { status: "warning", message: "no activities found" })
        return
      }

      // step 7: find actions
      const actionFinder = await actions.Finder.loadDynamic(config.sourceDir)

      // step 8: execute the ActivityList
      this.emit("start", { stepCount: dynamicActivities.length } as events.Start)
      process.chdir(config.workspace.platformified())
      await run.sequential(dynamicActivities, actionFinder, config, targets, this)
    } finally {
      process.chdir(originalDir)
    }
  }

  on(name: events.Name, handler: events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
