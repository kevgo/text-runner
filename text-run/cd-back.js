// @flow

import type { ActionArgs } from '../src/commands/run/5-execute/action-args.js'

module.exports = async function (args: ActionArgs) {
  if (global.cdHistory == null) throw new Error('no CD history')
  args.formatter.output('cd ' + global.cdHistory)
  process.chdir(global.cdHistory)
}
