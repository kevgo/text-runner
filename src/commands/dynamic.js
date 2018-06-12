// @flow

import type { Configuration } from '../configuration/configuration.js'

const { bold, green, magenta, red } = require('chalk')
const executeSequential = require('../runners/execute-sequential.js')
const extractActivities = require('../activity-list/extract-activities.js')
const extractImagesAndLinks = require('../activity-list/extract-images-and-links.js')
const findLinkTargets = require('../link-targets/find-link-targets.js')
const rimraf = require('rimraf')
const createWorkingDir = require('../working-dir/create-working-dir.js')
const readAndParseFile = require('../parsers/read-and-parse-file.js')
const getFileNames = require('../finding-files/get-filenames.js')
const StatsCounter = require('../runners/stats-counter.js')

async function dynamicCommand (config: Configuration): Promise<Array<Error>> {
  const stats = new StatsCounter()

  // step 0: create working dir
  if (!config.workspace) {
    config.workspace = createWorkingDir(config.useSystemTempDirectory)
  }

  // step 1: find files
  const filenames = getFileNames(config)
  if (filenames.length === 0) {
    console.log(magenta('no Markdown files found'))
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
    console.log(magenta('no activities found'))
    return []
  }

  // step 5: execute the ActivityList
  process.chdir(config.workspace)
  var error = await executeSequential(activities, config, linkTargets, stats)

  // step 6: cleanup
  process.chdir(config.sourceDir)
  if (error && !config.keepTmp) rimraf.sync(config.workspace)

  // step 7: write stats
  var text = '\n'
  var color
  if (error) {
    color = red
    text += red(`1 error, `)
  } else {
    color = green
    text += green('Success! ')
  }
  text += color(
    `${activities.length + links.length} activities in ${
      filenames.length
    } files`
  )
  if (stats.warnings() > 0) {
    text += color(', ')
    text += magenta(`${stats.warnings()} warnings`)
  }
  text += color(`, ${stats.duration()}`)
  console.log(bold(text))
  if (error) {
    return [error]
  } else {
    return []
  }
}

module.exports = dynamicCommand
