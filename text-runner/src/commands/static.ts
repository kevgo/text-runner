import * as color from "colorette"
import { extractImagesAndLinks } from "../activity-list/extract-images-and-links"
import { instantiateFormatter } from "../configuration/instantiate-formatter"
import { Configuration } from "../configuration/types/configuration"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeParallel } from "../runners/execute-parallel"
import { StatsCounter } from "../runners/helpers/stats-counter"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import { ActivityResult } from "../activity-list/types/activity-result"

export async function staticCommand(config: Configuration): Promise<ActivityResult[]> {
  // step 1: create working dir
  if (!config.workspace) {
    config.workspace = await createWorkspace(config)
  }

  // step 2: find files
  const filenames = await getFileNames(config)
  if (filenames.length === 0) {
    console.log(color.magenta("no Markdown files found"))
    return []
  }
  const stats = new StatsCounter(filenames.length)

  // step 3: read and parse files
  const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)

  // step 4: find link targets
  const linkTargets = findLinkTargets(ASTs)

  // step 5: extract activities
  const links = extractImagesAndLinks(ASTs)
  if (links.length === 0) {
    console.log(color.magenta("no activities found"))
    return []
  }

  // step 6: find actions
  const actionFinder = ActionFinder.loadStatic()

  // step 7: execute the ActivityList
  const formatter = instantiateFormatter(config.formatterName, links.length, config)
  process.chdir(config.workspace)
  const jobs = executeParallel(links, actionFinder, linkTargets, config, stats, formatter)
  const results = await Promise.all(jobs)
  const errors = results.map((result) => result.error).filter((error) => error) as Error[]

  // step 8: cleanup
  process.chdir(config.sourceDir)

  // step 9: write stats
  if (config.formatterName !== "silent") {
    let text = "\n"
    let colorFn
    if (errors.length === 0) {
      colorFn = color.green
      text += color.green("Success! ")
    } else {
      colorFn = color.red
      text += color.red(`${results.length} errors, `)
    }
    text += colorFn(`${links.length} activities in ${filenames.length} files`)
    text += colorFn(`, ${stats.duration()}`)
    console.log(color.bold(text))
  }
  return results
}
