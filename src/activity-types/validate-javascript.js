// @flow

import type {Activity} from '../commands/run/activity.js'

// Runs the JavaScript code given in the code block
module.exports = function (activity: Activity) {
  activity.formatter.action('validating JavaScript')
  const code = activity.searcher.tagContent('fence')
  activity.formatter.output(code)

  try {
    /* eslint-disable no-new, no-new-func */
    new Function(code)
  } catch (e) {
    throw new Error(`invalid Javascript: ${e.message}`)
  }
}
