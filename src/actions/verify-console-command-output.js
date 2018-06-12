// @flow

import type { ActionArgs } from '../runners/action-args.js'

const jsdiffConsole = require('jsdiff-console')

module.exports = function (args: ActionArgs) {
  args.formatter.name('verifying the output of the last run console command')

  const expectedLines = args.nodes
    .text()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)

  const actualLines = global.consoleCommandOutput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)

  const commonLines = actualLines.filter(line => expectedLines.includes(line))
  jsdiffConsole(expectedLines, commonLines)
}
