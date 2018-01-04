// @flow

const jsdiffConsole = require('jsdiff-console')

// Runs the given commands on the console.
// Waits until the command is finished.
module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  args.formatter.start('verifying the output of the last started console command')

  const expectedLines = args.searcher.nodeContent({type: 'fence'}, ({content, nodes}) => {
    if (nodes.length === 0) return 'no fenced blocks found'
    if (nodes.length > 1) return 'found #{nodes.length} fenced code blocks. Expecting only one.'
    if (!content) return 'empty fenced block found'
  }).split('\n')
    .map((line) => line.trim())
    .filter((line) => line)

  const actualLines = global.startConsoleCommandOutput.split('\n')
                                                      .map((line) => line.trim())
                                                      .filter((line) => line)

  const commonLines = actualLines.filter((line) => expectedLines.includes(line))
  jsdiffConsole(expectedLines, commonLines)
}
