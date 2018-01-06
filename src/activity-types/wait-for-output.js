// @flow

import type {Activity} from '../commands/run/activity.js'

// Waits until the currently running console command produces the given output
module.exports = async function (activity: Activity) {
  activity.formatter.action('waiting for output of the running console process')
  const expectedOutput = activity.searcher.tagContent('fence')
  const expectedLines = expectedOutput.split('\n')
                                      .map((line) => line.trim())
                                      .filter((line) => line)
  for (let line of expectedLines) {
    activity.formatter.output(`waiting for ${line}`)
    await global.runningProcess.waitForText(line)
  }
}
