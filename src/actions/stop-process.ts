import { ActionArgs } from '../runners/action-args'

import endChildProcessesI from 'end-child-processes'
import util from 'util'
import RunningProcess from './helpers/running-process'

const endChildProcesses = util.promisify(endChildProcessesI)

// Stops the currently running console command.
export default async function(args: ActionArgs) {
  args.formatter.name('stopping the long-running process')
  if (!RunningProcess.instance().hasProcess()) {
    throw new Error('No running process found')
  }
  RunningProcess.instance().kill()
  await endChildProcesses()
  RunningProcess.instance().reset()
}
