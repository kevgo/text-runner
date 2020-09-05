import { extractImagesAndLinks } from "../activity-list/extract-images-and-links"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeParallel } from "../runners/execute-parallel"
import { StatsCounter } from "../runners/helpers/stats-counter"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import { EventEmitter } from "events"
import { Configuration } from "../configuration/types/configuration"
import { CommandEvent, Command } from "./command"
import { StartArgs, FinishArgs, WarnArgs } from "../formatters/formatter"

export class StaticCommand extends EventEmitter implements Command {
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
      const stats = new StatsCounter(filenames.length)

      // step 3: read and parse files
      const ASTs = await parseMarkdownFiles(filenames, this.config.sourceDir)

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
      process.chdir(this.config.workspace)
      const parResults = executeParallel(links, actionFinder, linkTargets, this.config, stats, this)
      await Promise.all(parResults)

      // step 8: cleanup
      process.chdir(this.config.sourceDir)

      // step 9: write stats
      const finishArgs: FinishArgs = { stats }
      this.emit(CommandEvent.finish, finishArgs)
    } finally {
      process.chdir(originalDir)
    }
  }
}
