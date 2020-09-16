import { extractActivities } from "../activity-list/extract-activities"
import { extractImagesAndLinks } from "../activity-list/extract-images-and-links"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeParallel } from "../runners/execute-parallel"
import { executeSequential } from "../runners/execute-sequential"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import { EventEmitter } from "events"
import { CommandEvent, Command } from "./command"
import { StartArgs, WarnArgs } from "../text-runner"
import { Configuration } from "../configuration/configuration"

/** executes "text-run run", prints everything, returns the number of errors encountered */
export class RunCommand extends EventEmitter implements Command {
  config: Configuration

  constructor(config: Configuration) {
    super()
    this.config = config
  }

  async execute() {
    const originalDir = process.cwd()
    try {
      // step 1: create workspace
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

      // step 5: find actions
      const actionFinder = ActionFinder.load(this.config.sourceDir)

      // step 6: extract activities
      const activities = extractActivities(ASTs, this.config.regionMarker)
      const links = extractImagesAndLinks(ASTs)
      if (activities.length + links.length === 0) {
        const warnArgs: WarnArgs = { message: "no activities found" }
        this.emit(CommandEvent.warning, warnArgs)
        return
      }

      // step 7: execute the ActivityList
      const startArgs: StartArgs = { stepCount: activities.length + links.length }
      this.emit(CommandEvent.start, startArgs)
      process.chdir(this.config.workspace)
      // kick off the parallel jobs to run in the background
      let parJobs = executeParallel(links, actionFinder, linkTargets, this.config, this)
      // execute the serial jobs
      await executeSequential(activities, actionFinder, this.config, linkTargets, this)
      await Promise.all(parJobs)

      // step 8: cleanup
      process.chdir(this.config.sourceDir)
    } finally {
      process.chdir(originalDir)
    }
  }
}
