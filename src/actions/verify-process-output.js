// @flow

import type { ActionArgs } from '../commands/run/5-execute/action-args.js'

// Waits until the currently running console command produces the given output
module.exports = async function (args: ActionArgs) {
  args.formatter.setTitle('verifying the output of the long-running process')
  const expectedOutput = args.nodes.textInNode('fence')
  const expectedLines = expectedOutput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
  for (let line of expectedLines) {
    args.formatter.output(`waiting for ${line}`)
    await global.runningProcess.waitForText(line)
  }
}
