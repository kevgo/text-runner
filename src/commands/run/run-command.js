// @flow

import type Configuration from '../../configuration/configuration.js'
import type Formatter from '../../formatters/formatter.js'

// const ActivityTypeManager = require('./activity-type-manager.js')
const extractActivities = require('./4-activities/extract-activities.js')
const findLinkTargets = require('./3-link-targets/find-link-targets.js')
const rimraf = require('rimraf')
const UnprintedUserError = require('../../errors/unprinted-user-error.js')
const createWorkingDir = require('./0-working-dir/create-working-dir.js')
const readAndParseFile = require('./2-read-and-parse/read-and-parse-file.js')
const getFileNames = require('./1-find-files/get-filenames.js')

module.exports = async function runCommand (
  glob: ?string,
  config: Configuration,
  format: Formatter
) {
  // const activityTypesManager = new ActivityTypeManager(format, config)

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
  console.log(linkTargets)

  // step 4: extract activities
  const activities = extractActivities(ASTs, config, format)

  // step 5: execute the ActivityList

  // step 6: cleanup
  rimraf.sync(workingDir)
  this.formatter.suiteSuccess()
}
