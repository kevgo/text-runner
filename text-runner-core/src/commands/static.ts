import { extractImagesAndLinks } from "../activity-list/extract-images-and-links"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeParallel } from "../runners/execute-parallel"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import * as events from "events"
import { CommandEvent, Command } from "./command"
import { StartArgs, WarnArgs } from "../text-runner"
import { PartialConfiguration } from "../configuration/configuration"
import { backfillDefaults } from "../configuration/backfill-defaults"

export class StaticCommand extends events.EventEmitter implements Command {
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
      const links = extractImagesAndLinks(ASTs)
      if (links.length === 0) {
        const warnArgs: WarnArgs = { message: "no activities found" }
        this.emit(CommandEvent.warning, warnArgs)
        return
      }

      // step 6: find actions
      const actionFinder = ActionFinder.loadStatic()

      // step 7: execute the ActivityList
      const startArgs: StartArgs = { stepCount: links.length }
      this.emit(CommandEvent.start, startArgs)
      process.chdir(config.workspace)
      const parResults = executeParallel(links, actionFinder, linkTargets, config, this)
      await Promise.all(parResults)

      // step 8: cleanup
      process.chdir(config.sourceDir)
    } finally {
      process.chdir(originalDir)
    }
  }
}
