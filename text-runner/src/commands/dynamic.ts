import * as color from "colorette"
import { extractActivities } from "../activity-list/extract-activities"
import { instantiateFormatter } from "../configuration/instantiate-formatter"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { executeSequential } from "../runners/execute-sequential"
import { StatsCounter } from "../runners/helpers/stats-counter"
import { createWorkspace } from "../working-dir/create-working-dir"
import { ActionFinder } from "../actions/action-finder"
import { loadConfiguration } from "../configuration/load-configuration"
import { UserProvidedConfiguration } from "../configuration/types/user-provided-configuration"

export async function dynamicCommand(cmdlineArgs: UserProvidedConfiguration): Promise<number> {
  const originalDir = process.cwd()
  try {
    // step 1: load configuration from file
    const config = await loadConfiguration(cmdlineArgs)

    // step 2: create working dir
    if (!config.workspace) {
      config.workspace = await createWorkspace(config.useSystemTempDirectory)
    }

    // step 3: find files
    const filenames = await getFileNames(config)
    if (filenames.length === 0) {
      console.log(color.magenta("no Markdown files found"))
      return 0
    }
    const stats = new StatsCounter(filenames.length)

    // step 4: read and parse files
    const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)

    // step 5: find link targets
    const linkTargets = findLinkTargets(ASTs)

    // step 6: extract activities
    const activities = extractActivities(ASTs, config.regionMarker)
    if (activities.length === 0) {
      console.log(color.magenta("no activities found"))
      return 0
    }

    // step 7: find actions
    const actionFinder = ActionFinder.loadDynamic(config.sourceDir)

    // step 8: execute the ActivityList
    const formatter = instantiateFormatter(config.formatterName, activities.length, config)
    process.chdir(config.workspace)
    const error = await executeSequential(activities, actionFinder, config, linkTargets, stats, formatter)

    // step 9: write stats
    formatter.summary(stats)

    if (error) {
      return 1
    } else {
      return 0
    }
  } finally {
    process.chdir(originalDir)
  }
}
