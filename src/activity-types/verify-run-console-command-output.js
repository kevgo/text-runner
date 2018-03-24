// @flow

import type { Activity } from '../commands/run/activity.js'

const jsdiffConsole = require('jsdiff-console')

// Runs the given commands on the console.
// Waits until the command is finished.
module.exports = function (activity: Activity) {
  activity.formatter.setTitle(
    'verifying the output of the last run console command'
  )

  const expectedLines = activity.searcher
    .tagContent('fence')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)

  const actualLines = global.runConsoleCommandOutput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)

  const commonLines = actualLines.filter(line => expectedLines.includes(line))
  jsdiffConsole(expectedLines, commonLines)
}
