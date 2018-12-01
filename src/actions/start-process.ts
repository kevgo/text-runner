import chalk from 'chalk'
import deb from 'debug'
import { ObservableProcess } from 'observable-process'
import path from 'path'
import { Configuration } from '../configuration/configuration'
import callArgs from '../helpers/call-args'
import trimDollar from '../helpers/trim-dollar'
import { ActionArgs } from '../runners/action-args'
import RunningProcess from './helpers/running-process'

const debug = deb('start-console-command')

// Runs the given commands on the console.
// Leaves the command running.
export default (async function(args: ActionArgs) {
  const commandsToRun = getCommandsToRun(args)
  args.formatter.name(
    `starting a long-running process: ${chalk.bold(chalk.cyan(commandsToRun))}`
  )
  RunningProcess.instance().set(
    new ObservableProcess({
      commands: callArgs(commandsToRun),
      cwd: args.configuration.workspace,
      stderr: args.formatter.stderr,
      stdout: args.formatter.stdout
    })
  )
})

function getCommandsToRun(args: ActionArgs) {
  return args.nodes
    .textInNodeOfType('fence')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .map(trimDollar)
    .map(makeGlobal(args.configuration))
    .join(' && ')
}

function makeGlobal(configuration: Configuration) {
  configuration = configuration || {}
  let globals = {}
  try {
    globals = configuration.actions.runConsoleCommand.globals
  } catch (e) {
    // we can ignore null-pointer exceptions here since we have a default value
  }
  debug(`globals: ${JSON.stringify(globals)}`)
  return function(commandText) {
    const commandParts = commandText.split(' ')
    const command = commandParts[0]
    debug(`searching for global replacement for ${command}`)
    const replacement = globals[command]
    if (replacement) {
      debug(`found replacement: ${replacement}`)
      return (
        path.join(configuration.sourceDir, replacement) +
        ' ' +
        commandParts.splice(1).join(' ')
      )
    } else {
      return commandText
    }
  }
}
