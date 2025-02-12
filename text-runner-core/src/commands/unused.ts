import { EventEmitter } from "events"

import * as actions from "../actions/index.js"
import * as activities from "../activities/index.js"
import * as configuration from "../configuration/index.js"
import * as events from "../events/index.js"
import * as files from "../filesystem/index.js"
import * as parsers from "../parsers/index.js"
import { Command } from "./command.js"

export class Unused implements Command {
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
    // step 1: determine full configuration
    const config = await configuration.addDefaults(this.userConfig)

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
    const definedActivityNames = (await actions.Finder.load(config.sourceDir)).customActionNames()

    // step 6: identify unused activities
    const unusedActivityNames = definedActivityNames.filter(
      definedActivityName => !usedActivityNames.includes(definedActivityName),
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
