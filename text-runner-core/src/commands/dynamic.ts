import { extractActivities } from "../activities/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeSequential } from "../runners/execute-sequential"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import * as events from "events"
import { CommandEvent, Command } from "./command"
import * as configuration from "../configuration/index"
import { WarnArgs, StartArgs } from "../text-runner"

export class DynamicCommand extends events.EventEmitter implements Command {
  userConfig: configuration.PartialData

  constructor(userConfig: configuration.PartialData) {
    super()
    this.userConfig = userConfig
  }

  async execute(): Promise<void> {
    const originalDir = process.cwd()
    try {
      // step 1: determine full configuration
      const config = configuration.backfillDefaults(this.userConfig)

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
      await executeSequential(activities, actionFinder, config, linkTargets, this)
    } finally {
      process.chdir(originalDir)
    }
  }
}
