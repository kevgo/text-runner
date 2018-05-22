// @flow

import type { ActionArgs } from '../runners/action-args.js'

// Runs the JavaScript code given in the code block
module.exports = function (args: ActionArgs) {
  const code = args.nodes.textInNodeOfType('fence')
  args.formatter.log(code)
  try {
    /* eslint-disable no-new, no-new-func */
    new Function(code)
  } catch (e) {
    throw new Error(`invalid Javascript: ${e.message}`)
  }
}
