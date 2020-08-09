import color from "colorette"
import path from "path"
import { createObservableProcess, ObservableProcess } from "observable-process"
import { callArgs } from "../helpers/call-args"
import { CurrentCommand } from "../helpers/current-command"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs, AstNodeList } from "text-runner"
import { Configuration } from "../helpers/configuration"

interface ProcessInput {
  textToWait: string | null
  input: string
}

/**
 * Runs the given commands synchronously on the console.
 */
export async function exec(args: ActionArgs) {
  const config = await Configuration.load(path.join(args.configuration.sourceDir, "textrun-shell.js"))
  const commandsToRun = args.nodes
    .text()
    .split("\n")
    .map((command: string) => command.trim())
    .filter((command: string) => command.length > 0)
    // TODO: move this one line up
    .map(trimDollar)
    .map(config.pathMapper().globalizePathFunc())
    .join(" && ")
  if (commandsToRun === "") {
    throw new Error(
      `the <${args.nodes[0].tag} ${args.configuration.classPrefix}="shell/exec"> block contains no commands to run`
    )
  }
  args.name(`running console command: ${color.cyan(commandsToRun)}`)

  let input: ProcessInput[] = []
  if (args.nodes.hasNodeOfType("table")) {
    input = getInput(args.nodes)
  }

  const processor = createObservableProcess(callArgs(commandsToRun), {
    cwd: args.configuration.workspace,
  })
  // this is also used in the "verify-run-console-output" step
  CurrentCommand.set(processor)
  for (const inputLine of input) {
    enter(processor, inputLine)
  }
  await processor.waitForEnd()
  console.log(processor.output.fullText())
  if (processor.exitCode !== 0) {
    throw new Error(`command "${commandsToRun}" failed with exit code ${processor.exitCode}`)
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
        textToWait: trContent.textInNode(tdNode[0]),
      })
    }
  }
  return result
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
