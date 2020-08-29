import * as color from "colorette"
import { extractActivities } from "../activity-list/extract-activities"
import { extractImagesAndLinks } from "../activity-list/extract-images-and-links"
import { instantiateFormatter } from "../configuration/instantiate-formatter"
import { Configuration } from "../configuration/types/configuration"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeParallel } from "../runners/execute-parallel"
import { executeSequential } from "../runners/execute-sequential"
import { StatsCounter } from "../runners/helpers/stats-counter"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"

export async function runCommand(config: Configuration): Promise<Error[]> {
  // step 1: create workspace
  if (!config.workspace) {
    config.workspace = await createWorkspace(config.useSystemTempDirectory)
  }

  // step 2: find files
  const filenames = await getFileNames(config)
  if (filenames.length === 0) {
    console.log(color.magenta("no Markdown files found"))
    return []
  }
  const stats = new StatsCounter(filenames.length)

  // step 3: read and parse files
  const ASTs = await parseMarkdownFiles(filenames)

  // step 4: find link targets
  const linkTargets = findLinkTargets(ASTs)

  // step 5: find actions
  const actionFinder = ActionFinder.load(config.sourceDir)

  // step 6: extract activities
  const activities = extractActivities(ASTs, config.regionMarker)
  const links = extractImagesAndLinks(ASTs)
  if (activities.length + links.length === 0) {
    console.log(color.magenta("no activities found"))
    return []
  }

  // step 7: execute the ActivityList
  const formatter = instantiateFormatter(config.formatterName, activities.length + links.length, config)
  process.chdir(config.workspace)
  const jobs = executeParallel(links, actionFinder, linkTargets, config, stats, formatter)
  jobs.push(executeSequential(activities, actionFinder, config, linkTargets, stats, formatter))
  const results = (await Promise.all(jobs)).filter((r) => r) as Error[]

  // step 8: cleanup
  process.chdir(config.sourceDir)

  // step 9: write stats
  formatter.summary(stats)

  return results
}
