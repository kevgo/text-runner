// @flow

const {bold, cyan} = require('chalk')
const fs = require('fs')
const path = require('path')

// Verifies that the test workspace contains the given directory
module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}, done: DoneFunction) {
  const directory = args.searcher.nodeContent({type: 'code'}, ({content, nodes}) => {
    if (nodes.length === 0) return 'no code block found'
    if (nodes.length > 1) return 'too many code blocks found'
    if (content.trim().length === 0) return 'empty code block found'
  })

  const fullPath = path.join(args.configuration.testDir, directory)
  args.formatter.start(`verifying the ${bold(cyan(directory))} directory exists in the test workspace`)
  fs.lstat(fullPath, (err, stats) => {
    if (err) {
      args.formatter.error(`directory ${cyan(bold(directory))} does not exist in the test workspace`)
      done(new Error('1'))
    } else if (stats.isDirectory()) {
      args.formatter.success()
      done()
    } else {
      args.formatter.error(`${cyan(bold(directory))} exists but is not a directory`)
      done(new Error('1'))
    }
  })
}
