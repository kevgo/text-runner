// @flow

import type {Activity} from '../../typedefs/activity.js'

const {bold, cyan} = require('chalk')
const fs = require('fs')
const path = require('path')

// Verifies that a local directory linked in MarkDown exists
module.exports = function (activity: Activity) {
  const directory = activity.searcher.tagContent('link_open')
  activity.formatter.action(`directory ${bold(cyan(directory))} exists in the source code`)
  activity.formatter.action(`directory ${bold(cyan(directory))} exists in the source code`)
  var stats
  try {
    stats = fs.lstatSync(path.join(process.cwd(), directory))
  } catch (err) {
    throw new Error(`directory ${cyan(bold(directory))} does not exist in the source code`)
  }
  if (!stats.isDirectory()) {
    throw new Error(`${cyan(bold(directory))} exists in the source code but is not a directory`)
  }
}
