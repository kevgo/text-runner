import { ActionArgs } from '../runners/action-args'

import jsdiffConsole from 'jsdiff-console'
import RunningConsoleCommand from './helpers/running-console-command'

export default function(args: ActionArgs) {
  args.formatter.name('verifying the output of the last run console command')

  const expectedLines = args.nodes
    .text()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)

  const actualLines = RunningConsoleCommand.instance()
    .fullOutput()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)

  const commonLines = actualLines.filter(line => expectedLines.includes(line))
  jsdiffConsole(expectedLines, commonLines)
}
