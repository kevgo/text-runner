import { extractActivities } from "../activity-list/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeSequential } from "../runners/execute-sequential"
import { StatsCounter } from "../runners/helpers/stats-counter"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import { EventEmitter } from "events"
import { CommandEvent, Command } from "./command"
import { StartArgs, FinishArgs, WarnArgs } from "../formatters/formatter"
import { UserProvidedConfiguration } from "../configuration/types/user-provided-configuration"
import { loadConfiguration } from "../configuration/load-configuration"

export class DynamicCommand extends EventEmitter implements Command {
  userConfig: UserProvidedConfiguration

  constructor(userConfig: UserProvidedConfiguration) {
    super()
    this.userConfig = userConfig
  }

  async execute() {
    const originalDir = process.cwd()
    try {
      // step 1: load configuration
      const config = await loadConfiguration(this.userConfig)

      // step 2: create working dir
      if (!config.workspace) {
        config.workspace = await createWorkspace(config)
      }

      // step 3: find files
      const filenames = await getFileNames(config)
      if (filenames.length === 0) {
        const warnArgs: WarnArgs = { message: "no Markdown files found" }
        this.emit(CommandEvent.warning, warnArgs)
        return
      }
      const stats = new StatsCounter(filenames.length)

      // step 4: read and parse files
      const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)

      // step 5: find link targets
      const linkTargets = findLinkTargets(ASTs)

      // step 6: extract activities
      const activities = extractActivities(ASTs, config.regionMarker)
      if (activities.length === 0) {
        const warnArgs: WarnArgs = { message: "no activities found" }
        this.emit(CommandEvent.warning, warnArgs)
        return
      }

      // step 7: find actions
      const actionFinder = ActionFinder.loadDynamic(config.sourceDir)

      // step 8: execute the ActivityList
      const startArgs: StartArgs = { stepCount: activities.length }
      this.emit(CommandEvent.start, startArgs)
      process.chdir(config.workspace)
      const result = await executeSequential(activities, actionFinder, config, linkTargets, stats, this)

      // step 9: write stats
      const finishArgs: FinishArgs = { stats }
      this.emit(CommandEvent.finish, finishArgs)

      return result
    } finally {
      process.chdir(originalDir)
    }
  }
}
