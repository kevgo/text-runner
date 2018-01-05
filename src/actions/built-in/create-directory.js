// @flow

import type {Activity} from '../../typedefs/activity.js'

const {cyan} = require('chalk')
const mkdirp = require('mkdirp')
const path = require('path')
const debug = require('debug')('textrun:actions:create-directory')

module.exports = function (activity: Activity) {
  activity.formatter.action('creating directory')
  const directoryName = activity.searcher.tagContent('code')
  if (!directoryName) {
    throw new Error('empty directory name given')
  }
  debug(`directory to create: ${directoryName}`)

  activity.formatter.action(`creating directory ${cyan(directoryName)}`)
  const fullPath = path.join(activity.configuration.testDir, directoryName)
  debug(`directory to create: ${fullPath}`)
  mkdirp.sync(fullPath)
}
