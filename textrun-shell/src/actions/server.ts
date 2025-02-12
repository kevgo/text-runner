import * as color from "colorette"
import * as observableProcess from "observable-process"
import * as textRunner from "text-runner-core"
import * as trExt from "textrun-extension"

import { CurrentServer } from "../helpers/current-server.js"
import { trimDollar } from "../helpers/trim-dollar.js"

/**
 * The "start" action runs the given commands on the console.
 * It leaves the command running.
 */
export function server(action: textRunner.actions.Args): void {
  const commandsToRun = action.region
    .text()
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0)
    .map(trimDollar)
    .join(" && ")
  action.name(`starting a server process: ${color.bold(color.cyan(commandsToRun))}`)
  CurrentServer.instance().set(
    observableProcess.start(trExt.callArgs(commandsToRun, process.platform), {
      cwd: action.configuration.workspace.platformified(),
    })
  )
}
