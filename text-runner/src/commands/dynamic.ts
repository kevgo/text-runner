import * as color from "colorette"
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
  const stats = new StatsCounter(filenames.length)

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

  // step 9: write stats
  formatter.summary(stats)

  if (error) {
    return [error]
  } else {
    return []
  }
}
