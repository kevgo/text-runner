// @flow

import type { ActionArgs } from '../src/runners/action-args.js'

module.exports = async function (args: ActionArgs) {
  if (global.cdHistory == null) throw new Error('no CD history')
  args.formatter.log('cd ' + global.cdHistory)
  process.chdir(global.cdHistory)
}
