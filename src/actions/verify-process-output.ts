import UnprintedUserError from '../errors/unprinted-user-error'
import { ActionArgs } from '../runners/action-args'
import RunningProcess from './helpers/running-process'

// Waits until the currently running console command produces the given output
export default (async function(args: ActionArgs) {
  args.formatter.name('verifying the output of the long-running process')
  const expectedOutput = args.nodes.textInNodeOfType('fence')
  const expectedLines = expectedOutput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
  const process = RunningProcess.instance().process
  if (!process) {
    throw new UnprintedUserError(
      'Cannot verify process output since no process has been started',
      args.file,
      args.line
    )
  }
  for (const line of expectedLines) {
    args.formatter.log(`waiting for ${line}`)
    await process.waitForText(line)
  }
})
