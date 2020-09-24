import * as color from "colorette"
import { createObservableProcess, ObservableProcess } from "observable-process"
import { callArgs } from "textrun-extension"
import { CurrentCommand } from "../helpers/current-command"
import { trimDollar } from "../helpers/trim-dollar"
import * as tr from "text-runner-core"

interface ProcessInput {
  textToWait: string | null
  input: string
}

/**
 * The "runConsoleCommand" action runs the given commands on the console
 * and waits until the command is finished.
 */
export async function commandWithInput(action: tr.actions.Args): Promise<void> {
  const content = action.region.textInNodeOfTypes("fence", "code")
  const commandsToRun = content
    .split("\n")
    .map((command: string) => command.trim())
    .filter((e: string) => e)
    .map(trimDollar)
    .join(" && ")
  if (commandsToRun === "") {
    throw new Error(
      `the <${action.region[0].tag} ${action.configuration.regionMarker}="exec-with-input"> region contains no commands to run`
    )
  }
  action.name(`running console command: ${color.cyan(commandsToRun)}`)
  let input: ProcessInput[] = []
  if (action.region.hasNodeOfType("table")) {
    input = getInput(action.region)
  }
  // this needs to be global because it is used in the "verify-run-console-output" step
  const processor = createObservableProcess(callArgs(commandsToRun, process.platform), {
    cwd: action.configuration.workspace,
  })
  CurrentCommand.set(processor)
  for (const inputLine of input) {
    enter(processor, inputLine)
  }
  await processor.waitForEnd()
  action.log(processor.output.fullText())
}

async function enter(processor: ObservableProcess, input: ProcessInput) {
  processor.stdin.write(input.input + "\n")
  if (input.textToWait) {
    await processor.stdout.waitForText(input.textToWait)
  }
}

function getInput(nodes: tr.ast.NodeList): ProcessInput[] {
  const result: ProcessInput[] = []
  if (!nodes) {
    return result
  }
  // TODO: simplify this with an "tr.parser.ast.NodeList.getSubList" method
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
        textToWait: trContent.textInNode(tdNode[0]),
      })
    }
  }
  return result
}
