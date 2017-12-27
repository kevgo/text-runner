// @flow

const async = require('async')
const {bold, cyan} = require('chalk')

// Waits until the currently running console command produces the given output
module.exports = function (args: {formatter: Formatter, searcher: Searcher}, done: DoneFunction) {
  args.formatter.start('waiting for output of the running console process')

  const expectedOutput = args.searcher.nodeContent({type: 'fence'}, ({content, nodes}) => {
    if (nodes.length === 0) return 'no code blocks found'
    if (nodes.length > 1) return `found ${nodes.length} fenced code blocks. Expecting a maximum of 1.`
    if (!content) return 'the block that defines console commands to run is empty'
  })

  const expectedLines = expectedOutput.split('\n')
                                      .map((line) => line.trim())
                                      .filter((line) => line)

  async.eachSeries(expectedLines, waitFunction(args.formatter), (err) => {
    if (err) {
      args.formatter.error()
      done(err)
    } else {
      args.formatter.success()
      done()
    }
  })
}

function waitFunction (formatter: Formatter) {
  return (line, done) => {
    formatter.output(`waiting for ${line}`)
    global.runningProcess.wait(line, done)
  }
}
