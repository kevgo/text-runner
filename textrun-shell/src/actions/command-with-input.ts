import { styleText } from "node:util"
import * as observableProcess from "observable-process"
import * as textRunner from "text-runner-engine"
import { callArgs } from "textrun-extension"

import { Configuration } from "../helpers/configuration.js"
import { CurrentCommand } from "../helpers/current-command.js"
import { parseCommand } from "../helpers/parse-command.js"

interface ProcessInput {
  readonly input: string
  readonly textToWait: null | string
}

/**
 * The "runConsoleCommand" action runs the given commands on the console
 * and waits until the command is finished.
 */
export async function commandWithInput(action: textRunner.actions.Args): Promise<void> {
  var commandText = action.region[0].attributes["command"]
  if (commandText === "") {
    throw new Error('empty "command" attribute')
  }
  if (!commandText) {
    commandText = action.region.textInNodeOfTypes("fence", "code")
  }
  const configPath = action.configuration.sourceDir.joinStr("textrun-shell.js")
  const config = await Configuration.load(configPath)
  const commandsToRun = parseCommand(commandText, config.pathMapper().globalizePathFunc())
  if (commandsToRun === "") {
    throw new Error(
      `the <${
        action.region[0].tag
      } ${action.configuration.regionMarker}="exec-with-input"> region contains no commands to run`
    )
  }
  action.name(`running console command: ${styleText("cyan", commandsToRun)}`)
  let input: ProcessInput[] = []
  if (action.region.hasNodeOfType("table")) {
    input = getInput(action.region)
  }
  // this needs to be global because it is used in the "verify-run-console-output" step
  const processor = observableProcess.start(callArgs(commandsToRun, process.platform), {
    cwd: action.configuration.workspace.platformified()
  })
  for (const inputLine of input) {
    await enter(processor, inputLine)
  }
  const finished = (await processor.waitForEnd()) as observableProcess.FinishedProcess
  CurrentCommand.set(finished)
  action.log(processor.output.fullText())
}

async function enter(processor: observableProcess.RunningProcess, input: ProcessInput) {
  processor.stdin.write(input.input + "\n")
  if (input.textToWait) {
    await processor.stdout.waitForText(input.textToWait)
  }
}

function getInput(nodes: textRunner.ast.NodeList): ProcessInput[] {
  const result: ProcessInput[] = []
  if (!nodes) {
    return result
  }
  // TODO: simplify this with an "tr.parser.ast.NodeList.getSubList" method
  const tbodyNode = nodes.nodeOfTypes("tbody_open")
  const tbodyContent = nodes.nodesFor(tbodyNode)
  const trNodes = tbodyContent.nodesOfTypes("tr_open")
  for (const trNode of trNodes) {
    const trContent = nodes.nodesFor(trNode)
    if (trContent.length === 0) {
      // empty table row, ignore
      continue
    }
    const tdNode = trContent.nodesOfTypes("td_open")
    if (tdNode.length === 0) {
      // no TD found, possibly because there are THs --> ignore
      continue
    }
    if (tdNode.length === 1) {
      // single-column table, use that column
      const text = trContent.textInNode(tdNode[0])
      result.push({ input: text, textToWait: null })
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
