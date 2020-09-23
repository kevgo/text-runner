import { ActionFinder } from "../actions/action-finder"
import { extractActivities } from "../activities/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import * as events from "events"
import * as event from "../events/index"
import { Command } from "./command"
import * as configuration from "../configuration/index"

export class UnusedCommand extends events.EventEmitter implements Command {
  userConfig: configuration.PartialData

  constructor(userConfig: configuration.PartialData) {
    super()
    this.userConfig = userConfig
  }

  async execute(): Promise<void> {
    // step 1: determine full configuration
    const config = configuration.backfillDefaults(this.userConfig)

    // step 2: find files
    const filenames = await getFileNames(config)
    if (filenames.length === 0) {
      const warnArgs: event.WarnArgs = { message: "no Markdown files found" }
      this.emit(event.CommandEvent.warning, warnArgs)
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
    this.emit(event.CommandEvent.output, "Unused activities:")
    for (const unusedActivityName of unusedActivityNames) {
      this.emit(event.CommandEvent.output, `- ${unusedActivityName}`)
    }
  }
}
