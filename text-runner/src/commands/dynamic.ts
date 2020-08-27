import * as color from "colorette"
import * as fs from "fs-extra"
import { extractActivities } from "../activity-list/extract-activities"
import { instantiateFormatter } from "../configuration/instantiate-formatter"
import { Configuration } from "../configuration/types/configuration"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeSequential } from "../runners/execute-sequential"
import { StatsCounter } from "../runners/helpers/stats-counter"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"

export async function dynamicCommand(config: Configuration): Promise<Error[]> {
  const stats = new StatsCounter()

  // step 1: create working dir
  if (!config.workspace) {
    config.workspace = await createWorkspace(config.useSystemTempDirectory)
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
  const activities = extractActivities(ASTs, config.regionMarker)
  if (activities.length === 0) {
    console.log(color.magenta("no activities found"))
    return []
  }

  // step 6: find actions
  const actionFinder = ActionFinder.loadDynamic(config.sourceDir)

  // step 7: execute the ActivityList
  const formatter = instantiateFormatter(config.formatterName, activities.length, config)
  process.chdir(config.workspace)
  const error = await executeSequential(activities, actionFinder, config, linkTargets, stats, formatter)

  // step 8: cleanup
  process.chdir(config.sourceDir)
  if (!error && !config.keepWorkspace) {
    await fs.remove(config.workspace)
  }

  // step 9: write stats
  let text = "\n"
  let colorFn
  if (error) {
    colorFn = color.red
    text += color.red("1 error, ")
  } else {
    colorFn = color.green
    text += color.green("Success! ")
  }
  text += colorFn(`${activities.length} activities in ${filenames.length} files`)
  text += colorFn(`, ${stats.duration()}`)
  console.log(color.bold(text))
  if (error) {
    return [error]
  } else {
    return []
  }
}
