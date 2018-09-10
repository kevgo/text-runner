import { ActionArgs } from '../runners/action-args.js'
import { Configuration } from '../configuration/configuration.js'
import { WriteStream } from 'observable-process'

import callArgs from '../helpers/call-args'
import chalk from 'chalk'
import ObservableProcess from 'observable-process'
import path from 'path'
import trimDollar from '../helpers/trim-dollar'
import deb from 'debug'

const debug = deb('start-console-command')

// Runs the given commands on the console.
// Leaves the command running.
export default (async function(args: ActionArgs) {
  const commandsToRun = args.nodes
    .textInNodeOfType('fence')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .map(trimDollar)
    .map(makeGlobal(args.configuration))
    .join(' && ')

  args.formatter.name(
    `starting a long-running process: ${chalk.bold(chalk.cyan(commandsToRun))}`
  )
  global.startConsoleProcessOutput = ''
  global.runningProcess = new ObservableProcess({
    commands: callArgs(commandsToRun),
    cwd: args.configuration.workspace,
    stdout: log(args.formatter.stdout),
    stderr: args.formatter.stderr
  })
  global.runningProcessEnded = true
})

function log(stdout): WriteStream {
  return {
    write: text => {
      global.startConsoleProcessOutput += text
      return stdout.write(text)
    }
  }
}

function makeGlobal(configuration: Configuration) {
  configuration = configuration || {}
  var globals = {}
  try {
    // $FlowFixMe: we can ignore null-pointer exceptions here since we have a default value
    globals = configuration.fileData.actions.runConsoleCommand.globals
  } catch (e) {}
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
