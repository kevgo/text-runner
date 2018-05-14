// @flow

import type { Configuration } from '../../configuration/configuration.js'

const { bold, green, magenta } = require('chalk')
const executeParallel = require('./5-execute/execute-parallel.js')
const executeSequential = require('./5-execute/execute-sequential.js')
const extractActivities = require('./4-activities/extract-activities.js')
const extractImagesAndLinks = require('./4-activities/extract-images-and-links.js')
const findLinkTargets = require('./3-link-targets/find-link-targets.js')
const rimraf = require('rimraf')
const createWorkingDir = require('./0-working-dir/create-working-dir.js')
const readAndParseFile = require('./2-read-and-parse/read-and-parse-file.js')
const getFileNames = require('./1-find-files/get-filenames.js')
const StatsCounter = require('./stats-counter.js')

async function runCommand (config: Configuration) {
  const statsCounter = new StatsCounter()

  // step 0: create working dir
  const workingDir = createWorkingDir(config.useSystemTempDirectory)

  // step 1: find files
  var filenames = getFileNames(config)
  if (filenames.length === 0) {
    console.log(magenta('no Markdown files found'))
    return
  }

  // step 2: read and parse files
  const ASTs = await Promise.all(filenames.map(readAndParseFile))

  // step 3: find link targets
  const linkTargets = findLinkTargets(ASTs)

  // step 4: extract activities
  const activities = extractActivities(ASTs, config.classPrefix)
  const links = extractImagesAndLinks(ASTs)
  if (activities.length === 0 && links.length === 0) {
    console.log(magenta('no activities found'))
    return
  }

  // step 5: execute the ActivityList
  const parallelResults = await executeParallel(
    links,
    linkTargets,
    config,
    statsCounter
  )
  await Promise.all([
    parallelResults,
    executeSequential(activities, config, linkTargets, statsCounter)
  ])

  // step 6: cleanup
  rimraf.sync(workingDir)

  // step 7: write stats
  var text = green(
    `\nSuccess! ${activities.length + links.length} activities in ${
      filenames.length
    } files`
  )
  if (statsCounter.warnings() > 0) {
    text += green(', ')
    text += magenta(`${this.warningsCount} warnings`)
  }
  console.log(bold(text))
}

module.exports = runCommand
