// @flow

const jsdiffConsole = require('jsdiff-console')

// Runs the given commands on the console.
// Waits until the command is finished.
module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  args.formatter.start('verifying the output of the last started console command')

  const expectedLines = args.searcher.tagContent('fence')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)

  const actualLines = global.startConsoleCommandOutput.split('\n')
                                                      .map((line) => line.trim())
                                                      .filter((line) => line)

  const commonLines = actualLines.filter((line) => expectedLines.includes(line))
  jsdiffConsole(expectedLines, commonLines)
  args.formatter.success()
}
