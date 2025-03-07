import * as color from "colorette"
import * as observableProcess from "observable-process"
import * as textRunner from "text-runner-engine"
import * as trExt from "textrun-extension"

import { Configuration } from "../helpers/configuration.js"
import { CurrentCommand } from "../helpers/current-command.js"
import { trimDollar } from "../helpers/trim-dollar.js"

/** Runs the given commands synchronously on the console. */
export async function command(action: textRunner.actions.Args): Promise<void> {
  const configPath = action.configuration.sourceDir.joinStr("textrun-shell.js")
  const config = await Configuration.load(configPath)
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
      `the <${action.region[0].tag
      } ${action.configuration.regionMarker}="shell/command"> region contains no commands to run`
    )
  }
  action.name(`running console command: ${color.cyan(commandsToRun)}`)
  const processor = observableProcess.start(trExt.callArgs(commandsToRun, process.platform), {
    cwd: action.configuration.workspace.platformified()
  })
  // this is also used in the "verify-run-console-output" step
  const finished = (await processor.waitForEnd()) as observableProcess.FinishedProcess
  action.log(finished.combinedText)
  CurrentCommand.set(finished)
  if (finished.exitCode !== 0) {
    throw new Error(`command "${commandsToRun}" failed with exit code ${finished.exitCode}`)
  }
}
