import color from "colorette"
import { createObservableProcess } from "observable-process"
import path from "path"
import { Configuration } from "../../configuration/types/configuration"
import { Globals } from "../../configuration/types/globals"
import { callArgs } from "../helpers/call-args"
import { RunningProcess } from "../helpers/running-process"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs } from "../types/action-args"

// Runs the given commands on the console.
// Leaves the command running.
export default async function startProcess(args: ActionArgs) {
  const commandsToRun = getCommandsToRun(args)
  args.name(
    `starting a long-running process: ${color.bold(color.cyan(commandsToRun))}`
  )
  RunningProcess.instance().set(
    createObservableProcess(callArgs(commandsToRun), {
      cwd: args.configuration.workspace
    })
  )
}

function getCommandsToRun(args: ActionArgs) {
  return args.nodes
    .textInNodeOfType("fence")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line)
    .map(trimDollar)
    .map(makeGlobal(args.configuration))
    .join(" && ")
}

function makeGlobal(configuration: Configuration) {
  configuration = configuration || {}
  let globals: Globals = {}
  try {
    globals = configuration.actions.runConsoleCommand.globals as Globals
  } catch (e) {
    // we can ignore null-pointer exceptions here since we have a default value
  }
  return function(commandText: string) {
    const commandParts = commandText.split(" ")
    const command = commandParts[0]
    const replacement = globals[command]
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
