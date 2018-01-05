// @flow

import type {Activity} from '../../typedefs/activity.js'

const {cyan} = require('chalk')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const debug = require('debug')('textrun:actions:create-file')

module.exports = function (activity: Activity) {
  activity.formatter.action('creating file')
  const filePath = activity.searcher.tagContent(['emphasizedtext', 'strongtext'])
  const content = activity.searcher.tagContent(['fence', 'code'])
  activity.formatter.action(`creating file ${cyan(filePath)}`)
  const fullPath = path.join(activity.configuration.testDir, filePath)
  debug(fullPath)
  mkdirp.sync(path.dirname(fullPath))
  fs.writeFileSync(fullPath, content)
}
