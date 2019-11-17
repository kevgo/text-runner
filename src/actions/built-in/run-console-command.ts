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

/**
 * The "runConsoleCommand" action runs the given commands on the console
 * and waits until the command is finished.
 */
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
  // TODO: reduce redundancy
  if (!input.textToWait) {
    processor.stdin.write(input.input + "\n")
  } else {
    await processor.stdout.waitForText(input.textToWait)
    processor.stdin.write(input.input + "\n")
  }
}

function getInput(nodes: AstNodeList): ProcessInput[] {
  const result: ProcessInput[] = []
  if (!nodes) {
    return result
  }
  // TODO: simplify this with an "AstNodeList.getSubList" method
  const tbodyNode = nodes.getNodeOfTypes("tbody_open")
  const tbodyContent = nodes.getNodesFor(tbodyNode)
  const trNodes = tbodyContent.getNodesOfTypes("tr_open")
  for (const trNode of trNodes) {
    const trContent = nodes.getNodesFor(trNode)
    if (trContent.length === 0) {
      // empty table row, ignore
      continue
    }
    const tdNode = trContent.getNodesOfTypes("td_open")
    if (tdNode.length === 0) {
      // no TD found, possibly because there are THs --> ignore
      continue
    }
    if (tdNode.length === 1) {
      // single-column table, use that column
      const text = trContent.textInNode(tdNode[0])
      result.push({ textToWait: null, input: text })
    } else {
      // multi-colum table, use the last column
      result.push({
        input: trContent.textInNode(tdNode[tdNode.length - 1]),
        textToWait: trContent.textInNode(tdNode[0])
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
