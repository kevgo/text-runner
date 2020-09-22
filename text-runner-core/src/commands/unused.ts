import { ActionFinder } from "../actions/action-finder"
import { extractActivities } from "../activities/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import * as events from "events"
import { CommandEvent, Command } from "./command"
import { WarnArgs } from "../text-runner"
import { PartialConfiguration } from "../configuration/configuration"
import { backfillDefaults } from "../configuration/backfill-defaults"

export class UnusedCommand extends events.EventEmitter implements Command {
  userConfig: PartialConfiguration

  constructor(userConfig: PartialConfiguration) {
    super()
    this.userConfig = userConfig
  }

  async execute(): Promise<void> {
    // step 1: determine full configuration
    const config = backfillDefaults(this.userConfig)

    // step 2: find files
    const filenames = await getFileNames(config)
    if (filenames.length === 0) {
      const warnArgs: WarnArgs = { message: "no Markdown files found" }
      this.emit(CommandEvent.warning, warnArgs)
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
    this.emit(CommandEvent.output, "Unused activities:")
    for (const unusedActivityName of unusedActivityNames) {
      this.emit(CommandEvent.output, `- ${unusedActivityName}`)
    }
  }
}
