import * as color from "colorette"
import { createObservableProcess } from "observable-process"
import { callArgs } from "textrun-extension"
import { CurrentServer } from "../helpers/current-server"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs } from "@text-runner/core"

/**
 * The "start" action runs the given commands on the console.
 * It leaves the command running.
 */
export async function server(action: ActionArgs) {
  const commandsToRun = action.region
    .text()
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0)
    .map(trimDollar)
    .join(" && ")
  action.name(`starting a server process: ${color.bold(color.cyan(commandsToRun))}`)
  CurrentServer.instance().set(
    createObservableProcess(callArgs(commandsToRun, process.platform), {
      cwd: action.configuration.workspace,
    })
  )
}
