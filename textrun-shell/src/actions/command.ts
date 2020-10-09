import * as color from "colorette"
import * as observableProcess from "observable-process"
import * as tr from "text-runner-core"
import * as trExt from "textrun-extension"

import { Configuration } from "../helpers/configuration"
import { CurrentCommand } from "../helpers/current-command"
import { trimDollar } from "../helpers/trim-dollar"

/**
 * Runs the given commands synchronously on the console.
 */
export async function command(action: tr.actions.Args): Promise<void> {
  const config = Configuration.load(action.configuration.sourceDir.joinStr("textrun-shell.js"))
  const commandsToRun = action.region
    .text()
    .split("\n")
    .map((line: string) => line.trim())
    .map(trimDollar)
    .filter((line: string) => line.length > 0)
    .map(config.pathMapper().globalizePathFunc())
    .join(" && ")
  if (commandsToRun === "") {
    throw new Error(
      `the <${action.region[0].tag} ${action.configuration.regionMarker}="shell/command"> region contains no commands to run`
    )
  }
  action.name(`running console command: ${color.cyan(commandsToRun)}`)
  const processor = observableProcess.start(trExt.callArgs(commandsToRun, process.platform), {
    cwd: action.configuration.workspace.platformified(),
  })
  // this is also used in the "verify-run-console-output" step
  const finished = (await processor.waitForEnd()) as observableProcess.FinishedProcess
  action.log(finished.combinedText)
  CurrentCommand.set(finished)
  if (finished.exitCode !== 0) {
    throw new Error(`command "${commandsToRun}" failed with exit code ${finished.exitCode}`)
  }
}
