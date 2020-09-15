import { extractActivities } from "../activity-list/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeSequential } from "../runners/execute-sequential"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import { EventEmitter } from "events"
import { CommandEvent, Command } from "./command"
import { StartArgs, WarnArgs } from "../formatters/formatter"
import { Configuration } from "../configuration/configuration"

export class DynamicCommand extends EventEmitter implements Command {
  config: Configuration

  constructor(config: Configuration) {
    super()
    this.config = config
  }

  async execute() {
    const originalDir = process.cwd()
    try {
      // step 1: create working dir
      if (!this.config.workspace) {
        this.config.workspace = await createWorkspace(this.config)
      }

      // step 2: find files
      const filenames = await getFileNames(this.config)
      if (filenames.length === 0) {
        const warnArgs: WarnArgs = { message: "no Markdown files found" }
        this.emit(CommandEvent.warning, warnArgs)
        return
      }

      // step 3: read and parse files
      const ASTs = await parseMarkdownFiles(filenames, this.config.sourceDir)

      // step 4: find link targets
      const linkTargets = findLinkTargets(ASTs)

      // step 5: extract activities
      const activities = extractActivities(ASTs, this.config.regionMarker)
      if (activities.length === 0) {
        const warnArgs: WarnArgs = { message: "no activities found" }
        this.emit(CommandEvent.warning, warnArgs)
        return
      }

      // step 6: find actions
      const actionFinder = ActionFinder.loadDynamic(this.config.sourceDir)

      // step 7: execute the ActivityList
      const startArgs: StartArgs = { stepCount: activities.length }
      this.emit(CommandEvent.start, startArgs)
      process.chdir(this.config.workspace)
      await executeSequential(activities, actionFinder, this.config, linkTargets, this)
    } finally {
      process.chdir(originalDir)
    }
  }
}
