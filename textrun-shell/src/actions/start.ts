import color from "colorette"
import { createObservableProcess } from "observable-process"
import { callArgs } from "../helpers/call-args"
import { CurrentServer } from "../helpers/current-server"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs } from "text-runner"

/**
 * The "startProcess" action runs the given commands on the console.
 * It leaves the command running.
 */
export async function start(args: ActionArgs) {
  const commandsToRun = getCommandsToRun(args)
  args.name(`starting a server process: ${color.bold(color.cyan(commandsToRun))}`)
  CurrentServer.instance().set(
    createObservableProcess(callArgs(commandsToRun), {
      cwd: args.configuration.workspace,
    })
  )
}

function getCommandsToRun(args: ActionArgs) {
  return args.nodes
    .textInNodeOfType("fence")
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line)
    .map(trimDollar)
    .join(" && ")
}
