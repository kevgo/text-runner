// @flow

import type { Activity } from '../commands/run/4-activities/activity.js'

const { cyan } = require('chalk')
const mkdirp = require('mkdirp')
const path = require('path')

module.exports = function (activity: Activity) {
  const directoryName = activity.searcher.tagContent('code')
  if (!directoryName) {
    throw new Error('empty directory name given')
  }
  activity.formatter.setTitle(`create directory ${cyan(directoryName)}`)
  const fullPath = path.join(activity.configuration.testDir, directoryName)
  mkdirp.sync(fullPath)
}
