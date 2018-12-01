import { Configuration } from '../configuration/configuration'
import { ActionArgs } from '../runners/action-args'

import chalk from 'chalk'
import deb from 'debug'
import { ObservableProcess } from 'observable-process'
import path from 'path'
import callArgs from '../helpers/call-args'
import trimDollar from '../helpers/trim-dollar'
import AstNodeList from '../parsers/ast-node-list'
import RunningConsoleCommand from './helpers/running-console-command'

const debug = deb('textrun:actions:run-console-command')

interface ProcessInput {
  textToWait: string | null
  input: string
}

// Runs the given commands on the console.
// Waits until the command is finished.
export default (async function(args: ActionArgs) {
  const commandsToRun = args.nodes
    .textInNodeOfType('fence')
    .split('\n')
    .map(command => command.trim())
    .filter(e => e)
    .map(trimDollar)
    .map(makeGlobal(args.configuration))
    .join(' && ')
  if (commandsToRun === '') {
    throw new Error('the block that defines console commands to run is empty')
  }

  args.formatter.name(`running console command: ${chalk.cyan(commandsToRun)}`)
  let input: ProcessInput[] = []
  if (args.nodes.hasNodeOfType('table')) {
    input = getInput(args.nodes)
  }
  // this needs to be global because it is used in the "verify-run-console-output" step
  const processor = new ObservableProcess({
    commands: callArgs(commandsToRun),
    cwd: args.configuration.workspace,
    stderr: args.formatter.stderr,
    stdout: args.formatter.stdout
  })
  RunningConsoleCommand.set(processor)

  for (const inputLine of input) {
    enter(processor, inputLine)
  }
  await processor.waitForEnd()
})

async function enter(processor: ObservableProcess, input: ProcessInput) {
  if (!input.textToWait) {
    processor.enter(input.input)
  } else {
    await processor.waitForText(input.textToWait)
    processor.enter(input.input)
  }
}

function getInput(nodes: AstNodeList): ProcessInput[] {
  if (!nodes) {
    return []
  }
  const result: ProcessInput[] = []
  const rows = nodes.getNodesOfTypes('table_row_open')
  for (const row of rows) {
    const cellsN = nodes.getNodesFor(row)
    const cells = cellsN.getNodesOfTypes('table_cell')
    if (cells.length === 0) {
      continue
    }
    if (cells.length === 1) {
      // 3 cells = 1 td (<tr>, <td>, </tr>)
      result.push({ textToWait: null, input: cells[0].content })
    } else {
      result.push({
        input: cells[cells.length - 1].content,
        textToWait: cells[0].content
      })
    }
  }
  return result
}

function makeGlobal(configuration: Configuration) {
  configuration = configuration || {}
  let globals = {}
  try {
    globals = configuration.actions.runConsoleCommand.globals
  } catch (e) {
    // can ignore errors here
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
