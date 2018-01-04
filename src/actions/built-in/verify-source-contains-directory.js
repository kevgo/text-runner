// @flow

const {bold, cyan} = require('chalk')
const fs = require('fs')
const path = require('path')

// Verifies that a local directory linked in MarkDown exists
module.exports = function (args: {formatter: Formatter, searcher: Searcher}) {
  const directory = args.searcher.nodeContent({type: 'link_open'}, ({nodes}) => {
    if (nodes.length === 0) return 'no link found'
    if (nodes.length > 1) return 'too many links found'
  })

  args.formatter.start(`verifying the ${bold(cyan(directory))} directory exists in the source code`)
  var stats
  try {
    stats = fs.lstatSync(path.join(process.cwd(), directory))
  } catch (err) {
    throw new Error(`directory ${cyan(bold(directory))} does not exist in the source code`)
  }
  if (stats.isDirectory()) {
    args.formatter.success(`directory ${cyan(bold(directory))} exists in the source code`)
  } else {
    throw new Error(`${cyan(bold(directory))} exists in the source code but is not a directory`)
  }
}
