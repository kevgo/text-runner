import { extractActivities } from "../activity-list/extract-activities"
import { extractImagesAndLinks } from "../activity-list/extract-images-and-links"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeParallel } from "../runners/execute-parallel"
import { executeSequential } from "../runners/execute-sequential"
import { StatsCounter } from "../runners/helpers/stats-counter"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import { EventEmitter } from "events"
import { CommandEvent, Command } from "./command"
import { FinishArgs, StartArgs, WarnArgs } from "../formatters/formatter"
import { UserProvidedConfiguration } from "../configuration/types/user-provided-configuration"
import { loadConfiguration } from "../configuration/load-configuration"

/** executes "text-run run", prints everything, returns the number of errors encountered */
export class RunCommand extends EventEmitter implements Command {
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

      // step 2: create workspace
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

      // step 6: find actions
      const actionFinder = ActionFinder.load(config.sourceDir)

      // step 7: extract activities
      const activities = extractActivities(ASTs, config.regionMarker)
      const links = extractImagesAndLinks(ASTs)
      if (activities.length + links.length === 0) {
        const warnArgs: WarnArgs = { message: "no activities found" }
        this.emit(CommandEvent.warning, warnArgs)
        return
      }

      // step 8: execute the ActivityList
      const startArgs: StartArgs = { stepCount: activities.length + links.length }
      this.emit(CommandEvent.start, startArgs)
      process.chdir(config.workspace)
      // kick off the parallel jobs to run in the background
      let parJobs = executeParallel(links, actionFinder, linkTargets, config, stats, this)
      // execute the serial jobs
      await executeSequential(activities, actionFinder, config, linkTargets, stats, this)
      await Promise.all(parJobs)

      // step 9: cleanup
      process.chdir(config.sourceDir)

      // step 10: finish
      const finishArgs: FinishArgs = { stats }
      this.emit(CommandEvent.finish, finishArgs)
    } finally {
      process.chdir(originalDir)
    }
  }
}
