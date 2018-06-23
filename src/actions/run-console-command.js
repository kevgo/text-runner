// @flow

import type { ActionArgs } from '../runners/action-args.js'
import type { Configuration } from '../configuration/configuration.js'
import type { WriteStream } from 'observable-process'

const AstNodeList = require('../parsers/ast-node-list.js')
const callArgs = require('../helpers/call-args')
const { cyan } = require('chalk')
const debug = require('debug')('textrun:actions:run-console-command')
const Formatter = require('../formatters/formatter.js')
const ObservableProcess = require('observable-process')
const path = require('path')
const trimDollar = require('../helpers/trim-dollar')

type ProcessInput = {
  textToWait: ?string,
  input: string
}

// Runs the given commands on the console.
// Waits until the command is finished.
module.exports = async function (args: ActionArgs) {
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

  args.formatter.name(`running console command: ${cyan(commandsToRun)}`)
  var input = []
  if (args.nodes.hasNodeOfType('table')) {
    input = getInput(args.nodes, args.formatter)
  }
  // this needs to be global because it is used in the "verify-run-console-output" step
  global.consoleCommandOutput = ''
  const processor = new ObservableProcess({
    commands: callArgs(commandsToRun),
    cwd: args.configuration.workspace,
    stdout: log(args.formatter.stdout),
    stderr: args.formatter.stderr
  })

  for (let inputLine of input) {
    enter(processor, inputLine)
  }
  await processor.waitForEnd()
}

async function enter (processor: ObservableProcess, input: ProcessInput) {
  if (!input.textToWait) {
    processor.enter(input.input)
  } else {
    await processor.waitForText(input.textToWait)
    processor.enter(input.input)
  }
}

function getInput (
  nodes: AstNodeList,
  formatter: Formatter
): Array<ProcessInput> {
  if (!nodes) return []
  const result = []
  const rows = nodes.getNodesOfTypes('table_row_open')
  for (const row of rows) {
    const cellsN = nodes.getNodesFor(row)
    const cells = cellsN.getNodesOfTypes('table_cell')
    if (cells.length === 0) continue
    if (cells.length === 1) {
      // 3 cells = 1 td (<tr>, <td>, </tr>)
      result.push({ textToWait: null, input: cells[0].content })
    } else {
      result.push({
        textToWait: cells[0].content,
        input: cells[cells.length - 1].content
      })
    }
  }
  return result
}

function makeGlobal (configuration: Configuration) {
  configuration = configuration || {}
  var globals = {}
  try {
    globals = configuration.actions.runConsoleCommand.globals
  } catch (e) {}
  debug(`globals: ${JSON.stringify(globals)}`)
  return function (commandText) {
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

function log (stdout): WriteStream {
  return {
    write: text => {
      global.consoleCommandOutput += text
      return stdout.write(text)
    }
  }
}
