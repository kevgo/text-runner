import { Configuration } from '../configuration/configuration.js'

import chalk from 'chalk'
import executeParallel from '../runners/execute-parallel.js'
import executeSequential from '../runners/execute-sequential.js'
import extractActivities from '../activity-list/extract-activities.js'
import extractImagesAndLinks from '../activity-list/extract-images-and-links.js'
import findLinkTargets from '../link-targets/find-link-targets.js'
import rimraf from 'rimraf'
import createWorkingDir from '../working-dir/create-working-dir.js'
import readAndParseFile from '../parsers/read-and-parse-file.js'
import getFileNames from '../finding-files/get-filenames.js'
import StatsCounter from '../runners/stats-counter.js'

async function runCommand(config: Configuration): Promise<Array<Error>> {
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
  jobs.push(executeSequential(activities, config, linkTargets, stats))
  var results = await Promise.all(jobs)
  // $FlowFixMe: flow doesn't understand this works here
  results = results.filter(r => r)

  // step 6: cleanup
  process.chdir(config.sourceDir)
  if (results.length === 0 && !config.keepTmp) rimraf.sync(config.workspace)

  // step 7: write stats
  var text = '\n'
  var color
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

export default runCommand
