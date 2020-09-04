import { ActionFinder } from "../actions/action-finder"
import { extractActivities } from "../activity-list/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { loadConfiguration } from "../configuration/load-configuration"
import { UserProvidedConfiguration } from "../configuration/types/user-provided-configuration"
import { ExecuteResult } from "../runners/execute-result"

export async function unusedCommand(cmdlineArgs: UserProvidedConfiguration): Promise<ExecuteResult> {
  // step 1: load configuration from file
  const config = await loadConfiguration(cmdlineArgs)

  // step 2: find files
  const filenames = await getFileNames(config)
  if (filenames.length === 0) {
    return ExecuteResult.warning("no Markdown files found")
  }

  // step 3: read and parse files
  const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)

  // step 4: extract activities
  const usedActivityNames = extractActivities(ASTs, config.regionMarker).map((activity) => activity.actionName)

  // step 5: find defined activities
  const definedActivityNames = ActionFinder.load(config.sourceDir).customActionNames()

  // step 6: identify unused activities
  const unusedActivityNames = definedActivityNames.filter(
    (definedActivityName) => !usedActivityNames.includes(definedActivityName)
  )

  // step 7: write results
  console.log("Unused activities:")
  for (const unusedActivityName of unusedActivityNames) {
    console.log(`- ${unusedActivityName}`)
  }

  return ExecuteResult.empty()
}
