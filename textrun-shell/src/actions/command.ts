import { styleText } from "node:util"
import * as observableProcess from "observable-process"
import * as textRunner from "text-runner-engine"
import * as trExt from "textrun-extension"

import { Configuration } from "../helpers/configuration.js"
import { CurrentCommand } from "../helpers/current-command.js"
import { trimDollar } from "../helpers/trim-dollar.js"

/** Runs the given commands synchronously on the console. */
export async function command(action: textRunner.actions.Args): Promise<void> {
  action.name("run shell command")
  const configPath = action.configuration.sourceDir.joinStr("textrun-shell.js")
  const config = await Configuration.load(configPath)
  var commandText = action.region[0].attributes["command"]
  if (commandText === "") {
    throw new Error("empty filename attribute")
  }
  if (!commandText) {
    commandText = action.region.text()
  }
  const commandsToRun = commandText
    .split("\n")
    .map((line: string) => line.trim())
    .map(trimDollar)
    .filter((line: string) => line.length > 0)
    .map(config.pathMapper().globalizePathFunc())
    .join(" && ")
  if (commandsToRun === "") {
    throw new Error(
      `the <${
        action.region[0].tag
      } ${action.configuration.regionMarker}="shell/command"> region contains no commands to run`
    )
  }
  const allowError = action.region[0].attributes["allow-error"] !== undefined
  action.name(`running console command: ${styleText("cyan", commandsToRun)}`)
  const processor = observableProcess.start(trExt.callArgs(commandsToRun, process.platform), {
    cwd: action.configuration.workspace.platformified()
  })
  // this is also used in the "verify-run-console-output" step
  const finished = (await processor.waitForEnd()) as observableProcess.FinishedProcess
  action.log(finished.combinedText)
  CurrentCommand.set(finished)
  if (finished.exitCode !== 0 && !allowError) {
    throw new Error(`command "${commandsToRun}" failed with exit code ${finished.exitCode}`)
  }
}
