// @flow

import type Configuration from '../../configuration/configuration.js'
import type Formatter from '../../formatters/formatter.js'

// const ActivityTypeManager = require('./activity-type-manager.js')
const executeParallel = require('./5-execute/execute-parallel.js')
const executeSequential = require('./5-execute/execute-sequential.js')
const extractActivities = require('./4-activities/extract-activities.js')
const extractImagesAndLinks = require('./4-activities/extract-images-and-links.js')
const findLinkTargets = require('./3-link-targets/find-link-targets.js')
const rimraf = require('rimraf')
const UnprintedUserError = require('../../errors/unprinted-user-error.js')
const createWorkingDir = require('./0-working-dir/create-working-dir.js')
const readAndParseFile = require('./2-read-and-parse/read-and-parse-file.js')
const getFileNames = require('./1-find-files/get-filenames.js')
const StatsCounter = require('./stats-counter.js')

module.exports = async function runCommand (
  glob: ?string,
  config: Configuration,
  format: Formatter
) {
  const statsCounter = new StatsCounter()

  // step 0: create working dir
  const workingDir = createWorkingDir(config.get('useSystemTempDirectory'))

  // step 1: find files
  var filenames = getFileNames(glob, config)
  if (filenames.length === 0) {
    throw new UnprintedUserError('no Markdown files found')
  }

  // step 2: read and parse files
  const ASTs = await Promise.all(filenames.map(readAndParseFile))

  // step 3: find link targets
  const linkTargets = findLinkTargets(ASTs)

  // step 4: extract activities
  const activities = extractActivities(ASTs, config.get('classPrefix'))
  const links = extractImagesAndLinks(ASTs)
  if (activities.length === 0 && links.length === 0) {
    throw new UnprintedUserError('no activities found')
  }

  // step 5: execute the ActivityList
  const parallelResults = await executeParallel(
    links,
    linkTargets,
    format,
    config,
    statsCounter
  )
  await Promise.all([
    parallelResults,
    executeSequential(activities, format, config, linkTargets, statsCounter)
  ])

  // step 6: cleanup
  rimraf.sync(workingDir)

  green(
    `\nSuccess! ${this.stepsCount} blocks in ${this.filePaths.length} files`
  )
  if (statsCounter.warningsCount > 0) {
    text += green(', ')
    text += magenta(`${this.warningsCount} warnings`)
  }
  console.log(bold(text))
}
