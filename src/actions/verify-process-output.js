// @flow

import type { ActionArgs } from '../runners/action-args.js'

// Waits until the currently running console command produces the given output
module.exports = async function (args: ActionArgs) {
  args.formatter.name('verifying the output of the long-running process')
  const expectedOutput = args.nodes.textInNodeOfType('fence')
  const expectedLines = expectedOutput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
  for (let line of expectedLines) {
    args.formatter.log(`waiting for ${line}`)
    await global.runningProcess.waitForText(line)
  }
}
