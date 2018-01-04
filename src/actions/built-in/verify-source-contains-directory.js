// @flow

const {bold, cyan} = require('chalk')
const fs = require('fs')
const path = require('path')

// Verifies that a local directory linked in MarkDown exists
module.exports = function (activity: Activity) {
  const directory = activity.searcher.nodeContent({type: 'link_open'}, ({nodes}) => {
    if (nodes.length === 0) return 'no link found'
    if (nodes.length > 1) return 'too many links found'
  })

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
