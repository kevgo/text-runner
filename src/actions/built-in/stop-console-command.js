// @flow

import type {Activity} from '../../typedefs/activity.js'
import type Configuration from '../../configuration.js'
import type Formatter from '../../formatters/formatter.js'
import type Searcher from '../../commands/run/searcher.js'

// Stops the currently running console command.
module.exports = function (activity: Activity) {
  activity.formatter.action('stopping the long-running process')

  if (!global.runningProcess) {
    throw new Error('No running process found')
  }

  global.runningProcess.kill()
}
