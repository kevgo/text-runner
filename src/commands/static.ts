import { Configuration } from '../configuration/configuration'

import chalk from 'chalk'
import rimraf from 'rimraf'
import extractActivities from '../activity-list/extract-activities'
import extractImagesAndLinks from '../activity-list/extract-images-and-links'
import getFileNames from '../finding-files/get-filenames'
import findLinkTargets from '../link-targets/find-link-targets'
import readAndParseFile from '../parsers/read-and-parse-file'
import executeParallel from '../runners/execute-parallel'
import StatsCounter from '../runners/stats-counter'
import createWorkingDir from '../working-dir/create-working-dir'

async function staticCommand(config: Configuration): Promise<Error[]> {
  const stats = new StatsCounter()

  // step 0: create working dir
  if (!config.workspace) {
    config.workspace = createWorkingDir(config.useSystemTempDirectory)
  }

  // step 1: find files
  const filenames = getFileNames(config)
  if (filenames.length === 0) {
    console.log(chalk.magenta('no Markdown files found'))
    return []
  }

  // step 2: read and parse files
  const ASTs = await Promise.all(filenames.map(readAndParseFile))

  // step 3: find link targets
  const linkTargets = findLinkTargets(ASTs)

  // step 4: extract activities
  const activities = extractActivities(ASTs, config.classPrefix)
  const links = extractImagesAndLinks(ASTs)
  if (activities.length === 0 && links.length === 0) {
    console.log(chalk.magenta('no activities found'))
    return []
  }

  // step 5: execute the ActivityList
  process.chdir(config.workspace)
  const jobs = executeParallel(links, linkTargets, config, stats)
  const results = (await Promise.all(jobs)).filter(r => r) as Error[]

  // step 6: cleanup
  process.chdir(config.sourceDir)
  if (results.length === 0 && !config.keepTmp) {
    rimraf.sync(config.workspace)
  }

  // step 7: write stats
  let text = '\n'
  let color
  if (results.length === 0) {
    color = chalk.green
    text += chalk.green('Success! ')
  } else {
    color = chalk.red
    text += chalk.red(`${results.length} errors, `)
  }
  text += color(
    `${activities.length + links.length} activities in ${
      filenames.length
    } files`
  )
  if (stats.warnings() > 0) {
    text += color(', ')
    text += chalk.magenta(`${stats.warnings()} warnings`)
  }
  text += color(`, ${stats.duration()}`)
  console.log(chalk.bold(text))
  return results
}

export default staticCommand
