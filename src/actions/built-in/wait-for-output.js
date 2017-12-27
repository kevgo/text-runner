// @flow

const async = require('async')
const {bold, cyan} = require('chalk')
const util = require('util')

// Waits until the currently running console command produces the given output
module.exports = async function (args: {formatter: Formatter, searcher: Searcher}) {
  args.formatter.start('waiting for output of the running console process')

  const expectedOutput = args.searcher.nodeContent({type: 'fence'}, ({content, nodes}) => {
    if (nodes.length === 0) return 'no code blocks found'
    if (nodes.length > 1) return `found ${nodes.length} fenced code blocks. Expecting a maximum of 1.`
    if (!content) return 'the block that defines console commands to run is empty'
  })

  const expectedLines = expectedOutput.split('\n')
                                      .map((line) => line.trim())
                                      .filter((line) => line)

  const waitForInput = util.promisify(global.runningProcess.wait)
  for (let line of expectedLines) {
    args.formatter.output(`waiting for ${line}`)
    await waitForInput(line)
  }
  args.formatter.success()
}
