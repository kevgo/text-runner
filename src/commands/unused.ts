import { Configuration } from '../configuration/configuration'

import chalk from 'chalk'
import { extractActivities } from '../activity-list/extract-activities'
import { getFileNames } from '../finding-files/get-filenames'
import { readAndParseFile } from '../parsers/read-and-parse-file'
import { actionRepo } from '../runners/action-repo'

export async function unusedCommand(config: Configuration) {
  // step 1: find files
  const filenames = await getFileNames(config)
  if (filenames.length === 0) {
    console.log(chalk.magenta('no Markdown files found'))
    return
  }

  // step 2: read and parse files
  const ASTs = await Promise.all(filenames.map(readAndParseFile))

  // step 3: extract activities
  const usedActivityNames = extractActivities(ASTs, config.classPrefix).map(
    activity => activity.type
  )

  // step 4: find defined activities
  const definedActivityNames = actionRepo.customActionNames()

  // step 5: identify unused activities
  const unusedActivityNames = definedActivityNames.filter(
    definedActivityName => !usedActivityNames.includes(definedActivityName)
  )

  // step 6: write results
  console.log('Unused activities:')
  for (const unusedActivityName of unusedActivityNames) {
    console.log(`- ${unusedActivityName}`)
  }
}
