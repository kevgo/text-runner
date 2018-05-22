// @flow

import type { Configuration } from '../../configuration/configuration.js'

const { bold, green, magenta } = require('chalk')
const executeParallel = require('../../runners/execute-parallel.js')
const executeSequential = require('../../runners/execute-sequential.js')
const extractActivities = require('../../activity-list/extract-activities.js')
const extractImagesAndLinks = require('../../activity-list/extract-images-and-links.js')
const findLinkTargets = require('../../link-targets/find-link-targets.js')
const rimraf = require('rimraf')
const createWorkingDir = require('./create-working-dir.js')
const readAndParseFile = require('../../parsers/read-and-parse-file.js')
const getFileNames = require('../../finding-files/get-filenames.js')
const StatsCounter = require('../../runners/stats-counter.js')

async function runCommand (config: Configuration) {
  const statsCounter = new StatsCounter()

  // step 0: create working dir
  const workingDir = createWorkingDir(config.useSystemTempDirectory)

  // step 1: find files
  const filenames = getFileNames(config)
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
