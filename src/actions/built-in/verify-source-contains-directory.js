// @flow

const {bold, cyan} = require('chalk')
const fs = require('fs')
const path = require('path')

// Verifies that a local directory linked in MarkDown exists
module.exports = function (args: {formatter: Formatter, searcher: Searcher}, done: DoneFunction) {
  const directory = args.searcher.nodeContent({type: 'link_open'}, ({nodes}) => {
    if (nodes.length === 0) return 'no link found'
    if (nodes.length > 1) return 'too many links found'
  })

  args.formatter.start(`verifying the ${bold(cyan(directory))} directory exists in the source code`)
  fs.lstat(path.join(process.cwd(), directory), (err, stats) => {
    if (err) {
      args.formatter.error(`directory ${cyan(bold(directory))} does not exist in the source code`)
      done(new Error('1'))
    } else if (stats.isDirectory()) {
      args.formatter.success(`directory ${cyan(bold(directory))} exists in the source code`)
      done()
    } else {
      args.formatter.error(`${cyan(bold(directory))} exists in the source code but is not a directory`)
      done(new Error('1'))
    }
  })
}
