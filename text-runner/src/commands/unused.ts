import { ActionFinder } from "../actions/action-finder"
import { extractActivities } from "../activity-list/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { Configuration } from "../configuration/types/configuration"
import { EventEmitter } from "events"
import { CommandEvent, Command } from "./command"
import { WarnArgs } from "../formatters/formatter"

export class UnusedCommand extends EventEmitter implements Command {
  config: Configuration

  constructor(config: Configuration) {
    super()
    this.config = config
  }

  async execute() {
    // step 1: find files
    const filenames = await getFileNames(this.config)
    if (filenames.length === 0) {
      const warnArgs: WarnArgs = { message: "no Markdown files found" }
      this.emit(CommandEvent.warning, warnArgs)
      return
    }

    // step 2: read and parse files
    const ASTs = await parseMarkdownFiles(filenames, this.config.sourceDir)

    // step 3: extract activities
    const usedActivityNames = extractActivities(ASTs, this.config.regionMarker).map((activity) => activity.actionName)

    // step 4: find defined activities
    const definedActivityNames = ActionFinder.load(this.config.sourceDir).customActionNames()

    // step 5: identify unused activities
    const unusedActivityNames = definedActivityNames.filter(
      (definedActivityName) => !usedActivityNames.includes(definedActivityName)
    )

    // step 6: write results
    this.emit(CommandEvent.output, "Unused activities:")
    for (const unusedActivityName of unusedActivityNames) {
      this.emit(CommandEvent.output, `- ${unusedActivityName}`)
    }
  }
}
