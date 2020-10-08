import { EventEmitter } from "events"

import * as actions from "../actions"
import * as activities from "../activities"
import * as configuration from "../configuration/index"
import * as events from "../events/index"
import * as files from "../filesystem/index"
import * as parsers from "../parsers"
import { Command } from "./command"

export class Unused implements Command {
  userConfig: configuration.PartialData
  emitter: EventEmitter

  constructor(userConfig: configuration.PartialData) {
    this.userConfig = userConfig
    this.emitter = new EventEmitter()
  }

  emit(name: events.Name, payload: events.Args): void {
    this.emitter.emit(name, payload)
  }

  async execute(): Promise<void> {
    // step 1: determine full configuration
    const config = await configuration.backfillDefaults(this.userConfig)

    // step 2: find files
    const filenames = await files.getFileNames(config)
    if (filenames.length === 0) {
      this.emit("result", { status: "warning", message: "no Markdown files found" })
      return
    }

    // step 3: read and parse files
    const ASTs = await parsers.markdown.parse(filenames, config.sourceDir)

    // step 4: extract activities
    const usedActivityNames = activities.extractDynamic(ASTs, config.regionMarker).map(activity => activity.actionName)

    // step 5: find defined activities
    const definedActivityNames = actions.Finder.load(config.sourceDir).customActionNames()

    // step 6: identify unused activities
    const unusedActivityNames = definedActivityNames.filter(
      definedActivityName => !usedActivityNames.includes(definedActivityName)
    )

    // step 7: write results
    this.emit("output", "Unused activities:")
    for (const unusedActivityName of unusedActivityNames) {
      this.emit("output", `- ${unusedActivityName}`)
    }
  }

  on(name: events.Name, handler: events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
