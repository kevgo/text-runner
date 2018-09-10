import { ActionArgs } from '../runners/action-args.js'

import util from 'util'
import endChildProcesses = util.promisify(require('end-child-processes'))

// Stops the currently running console command.
export default async function(args: ActionArgs) {
  args.formatter.name('stopping the long-running process')
  if (!global.runningProcess) {
    throw new Error('No running process found')
  }
  global.runningProcess.kill()
  await endChildProcesses()
  global.runningProcess = null
}
