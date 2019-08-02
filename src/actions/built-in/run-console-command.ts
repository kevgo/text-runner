import color from "colorette"
import { createObservableProcess, ObservableProcess } from "observable-process"
import path from "path"
import { Configuration } from "../../configuration/types/configuration"
import { Globals } from "../../configuration/types/globals"
import { AstNodeList } from "../../parsers/standard-AST/ast-node-list"
import { callArgs } from "../helpers/call-args"
import { RunningConsoleCommand } from "../helpers/running-console-command"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs } from "../types/action-args"

interface ProcessInput {
  textToWait: string | null
  input: string
}

// Runs the given commands on the console.
// Waits until the command is finished.
export default async function runConsoleCommand(args: ActionArgs) {
  const commandsToRun = args.nodes
    .textInNodeOfType("fence")
    .split("\n")
    .map(command => command.trim())
    .filter(e => e)
    .map(trimDollar)
    .map(makeGlobal(args.configuration))
    .join(" && ")
  if (commandsToRun === "") {
    throw new Error("the block that defines console commands to run is empty")
  }

  args.name(`running console command: ${color.cyan(commandsToRun)}`)
  let input: ProcessInput[] = []
  if (args.nodes.hasNodeOfType("table")) {
    input = getInput(args.nodes)
  }
  // this needs to be global because it is used in the "verify-run-console-output" step
  const processor = createObservableProcess(callArgs(commandsToRun), {
    cwd: args.configuration.workspace
  })
  RunningConsoleCommand.set(processor)

  for (const inputLine of input) {
    enter(processor, inputLine)
  }
  await processor.waitForEnd()
  args.log(processor.output.fullText())
}

async function enter(processor: ObservableProcess, input: ProcessInput) {
  if (!input.textToWait) {
    processor.stdin.write(input.input + "\n")
  } else {
    await processor.stdout.waitForText(input.textToWait)
    processor.stdin.write(input.input + "\n")
  }
}

function getInput(nodes: AstNodeList): ProcessInput[] {
  if (!nodes) {
    return []
  }
  const result: ProcessInput[] = []
  const rows = nodes.getNodesOfTypes("table_row_open")
  for (const row of rows) {
    const cellsN = nodes.getNodesFor(row)
    const cells = cellsN.getNodesOfTypes("table_cell")
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

function makeGlobal(configuration: Configuration): (arg: string) => string {
  configuration = configuration || {}
  let globals: Globals = {}
  try {
    globals = configuration.actions.runConsoleCommand.globals as Globals
  } catch (e) {
    // can ignore errors here
  }
  return function(commandText: string): string {
    const commandParts = commandText.split(" ")
    const command = commandParts[0]
    const replacement = globals[command] as string | undefined
    if (replacement) {
      return (
        path.join(configuration.sourceDir, replacement) +
        " " +
        commandParts.splice(1).join(" ")
      )
    } else {
      return commandText
    }
  }
}
