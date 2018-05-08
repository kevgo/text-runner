// @flow

import type { ActionArgs } from '../commands/run/5-execute/action-args.js'

// Runs the JavaScript code given in the code block
module.exports = function (args: ActionArgs) {
  const code = args.nodes.textInNode('fence')
  args.formatter.output(code)
  try {
    /* eslint-disable no-new, no-new-func */
    new Function(code)
  } catch (e) {
    throw new Error(`invalid Javascript: ${e.message}`)
  }
}
