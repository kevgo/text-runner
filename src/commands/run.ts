import color from "colorette"
import rimraf from "rimraf"
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
import { createWorkingDir } from "../working-dir/create-working-dir"

export async function runCommand(config: Configuration): Promise<Error[]> {
  const stats = new StatsCounter()

  // step 1: create working dir
  if (!config.workspace) {
    config.workspace = await createWorkingDir(config.useSystemTempDirectory)
  }

  // step 2: find files
  const filenames = await getFileNames(config)
  if (filenames.length === 0) {
    console.log(color.magenta("no Markdown files found"))
    return []
  }

  // step 3: read and parse files
  const ASTs = await parseMarkdownFiles(filenames)

  // step 4: find link targets
  const linkTargets = findLinkTargets(ASTs)

  // step 5: extract activities
  const activities = extractActivities(ASTs, config.classPrefix)
  const links = extractImagesAndLinks(ASTs)
  if (activities.length === 0 && links.length === 0) {
    console.log(color.magenta("no activities found"))
    return []
  }

  // step 6: execute the ActivityList
  const formatter = instantiateFormatter(config.formatterName, activities.length + links.length, config)
  process.chdir(config.workspace)
  const jobs = executeParallel(links, linkTargets, config, stats, formatter)
  jobs.push(executeSequential(activities, config, linkTargets, stats, formatter))
  const results = (await Promise.all(jobs)).filter((r) => r) as Error[]

  // step 7: cleanup
  process.chdir(config.sourceDir)
  if (results.length === 0 && !config.keepTmp) {
    // NOTE: calling fs.remove causes an exception on Windows here,
    //       hence we use rimraf
    rimraf.sync(config.workspace, { maxBusyTries: 20 })
  }

  // step 8: write stats
  let text = "\n"
  let colorFn: color.Style
  if (results.length === 0) {
    colorFn = color.green
    text += color.green("Success! ")
  } else {
    colorFn = color.red
    text += color.red(`${results.length} errors, `)
  }
  text += colorFn(`${activities.length + links.length} activities in ${filenames.length} files, ${stats.duration()}`)
  console.log(color.bold(text))
  return results
}
