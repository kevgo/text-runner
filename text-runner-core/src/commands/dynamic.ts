import { extractActivities } from "../activity-list/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeSequential } from "../runners/execute-sequential"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import * as events from "events"
import { CommandEvent, Command } from "./command"
import { PartialConfiguration } from "../configuration/configuration"
import { WarnArgs, StartArgs } from "../text-runner"
import { backfillDefaults } from "../configuration/backfill-defaults"

export class DynamicCommand extends events.EventEmitter implements Command {
  userConfig: PartialConfiguration

  constructor(userConfig: PartialConfiguration) {
    super()
    this.userConfig = userConfig
  }

  async execute() {
    const originalDir = process.cwd()
    try {
      // step 1: determine full configuration
      const config = backfillDefaults(this.userConfig)

      // step 1: create working dir
      if (!config.workspace) {
        config.workspace = await createWorkspace(config)
      }

      // step 2: find files
      const filenames = await getFileNames(config)
      if (filenames.length === 0) {
        const warnArgs: WarnArgs = { message: "no Markdown files found" }
        this.emit(CommandEvent.warning, warnArgs)
        return
      }

      // step 3: read and parse files
      const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)

      // step 4: find link targets
      const linkTargets = findLinkTargets(ASTs)

      // step 5: extract activities
      const activities = extractActivities(ASTs, config.regionMarker)
      if (activities.length === 0) {
        const warnArgs: WarnArgs = { message: "no activities found" }
        this.emit(CommandEvent.warning, warnArgs)
        return
      }

      // step 6: find actions
      const actionFinder = ActionFinder.loadDynamic(config.sourceDir)

      // step 7: execute the ActivityList
      const startArgs: StartArgs = { stepCount: activities.length }
      this.emit(CommandEvent.start, startArgs)
      process.chdir(config.workspace)
      await executeSequential(activities, actionFinder, config, linkTargets, this)
    } finally {
      process.chdir(originalDir)
    }
  }
}