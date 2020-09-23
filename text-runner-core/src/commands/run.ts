import * as activities from "../activities/index"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeParallel } from "../runners/execute-parallel"
import { executeSequential } from "../runners/execute-sequential"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import * as events from "events"
import * as event from "../events"
import { Command } from "./command"
import * as configuration from "../configuration/index"

/** executes "text-run run", prints everything, returns the number of errors encountered */
export class RunCommand extends events.EventEmitter implements Command {
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

      // step 2: create workspace
      if (!config.workspace) {
        config.workspace = await createWorkspace(config)
      }

      // step 3: find files
      const filenames = await getFileNames(config)
      if (filenames.length === 0) {
        const warnArgs: event.WarnArgs = { message: "no Markdown files found" }
        this.emit("warning", warnArgs)
        return
      }

      // step 4: read and parse files
      const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)

      // step 5: find link targets
      const linkTargets = findLinkTargets(ASTs)

      // step 6: find actions
      const actionFinder = ActionFinder.load(config.sourceDir)

      // step 7: extract activities
      const dynamicActivities = activities.extractActivities(ASTs, config.regionMarker)
      const links = activities.extractImagesAndLinks(ASTs)
      if (dynamicActivities.length + links.length === 0) {
        const warnArgs: event.WarnArgs = { message: "no activities found" }
        this.emit("warning", warnArgs)
        return
      }

      // step 8: execute the ActivityList
      const startArgs: event.StartArgs = { stepCount: dynamicActivities.length + links.length }
      this.emit("start", startArgs)
      process.chdir(config.workspace)
      // kick off the parallel jobs to run in the background
      const parJobs = executeParallel(links, actionFinder, linkTargets, config, this)
      // execute the serial jobs
      await executeSequential(dynamicActivities, actionFinder, config, linkTargets, this)
      await Promise.all(parJobs)

      // step 9: cleanup
      process.chdir(config.sourceDir)
    } finally {
      process.chdir(originalDir)
    }
  }
}
