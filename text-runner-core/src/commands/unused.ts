import { ActionFinder } from "../actions/action-finder"
import { extractActivities } from "../activities/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import * as events from "../events/index"
import { Command } from "./command"
import * as configuration from "../configuration/index"
import { EventEmitter } from "events"

export class Unused implements Command {
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
    // step 1: determine full configuration
    const config = configuration.backfillDefaults(this.userConfig)

    // step 2: find files
    const filenames = await getFileNames(config)
    if (filenames.length === 0) {
      const warnArgs: events.WarnArgs = { message: "no Markdown files found" }
      this.emit("warning", warnArgs)
      return
    }

    // step 3: read and parse files
    const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)

    // step 4: extract activities
    const usedActivityNames = extractActivities(ASTs, config.regionMarker).map(activity => activity.actionName)

    // step 5: find defined activities
    const definedActivityNames = ActionFinder.load(config.sourceDir).customActionNames()

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

  on(name: events.CommandEvent, handler: events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
