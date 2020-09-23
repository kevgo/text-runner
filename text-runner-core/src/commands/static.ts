import { extractImagesAndLinks } from "../activities/extract-images-and-links"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeParallel } from "../runners/execute-parallel"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import * as events from "events"
import { Command } from "./command"
import * as event from "../events/index"
import * as configuration from "../configuration/index"

export class StaticCommand extends events.EventEmitter implements Command {
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
        const warnArgs: event.WarnArgs = { message: "no Markdown files found" }
        this.emit(event.CommandEvent.warning, warnArgs)
        return
      }

      // step 4: read and parse files
      const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)

      // step 5: find link targets
      const linkTargets = findLinkTargets(ASTs)

      // step 6: extract activities
      const links = extractImagesAndLinks(ASTs)
      if (links.length === 0) {
        const warnArgs: event.WarnArgs = { message: "no activities found" }
        this.emit(event.CommandEvent.warning, warnArgs)
        return
      }

      // step 7: find actions
      const actionFinder = ActionFinder.loadStatic()

      // step 8: execute the ActivityList
      const startArgs: event.StartArgs = { stepCount: links.length }
      this.emit(event.CommandEvent.start, startArgs)
      process.chdir(config.workspace)
      const parResults = executeParallel(links, actionFinder, linkTargets, config, this)
      await Promise.all(parResults)

      // step 9: cleanup
      process.chdir(config.sourceDir)
    } finally {
      process.chdir(originalDir)
    }
  }
}
