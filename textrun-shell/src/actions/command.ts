import * as color from "colorette"
import * as path from "path"
import { createObservableProcess } from "observable-process"
import * as trExt from "textrun-extension"
import { CurrentCommand } from "../helpers/current-command"
import { trimDollar } from "../helpers/trim-dollar"
import * as tr from "text-runner-core"
import { Configuration } from "../helpers/configuration"

/**
 * Runs the given commands synchronously on the console.
 */
export async function command(action: tr.actions.Args): Promise<void> {
  const config = Configuration.load(path.join(action.configuration.sourceDir, "textrun-shell.js"))
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
  const processor = createObservableProcess(trExt.callArgs(commandsToRun, process.platform), {
    cwd: action.configuration.workspace,
  })
  // this is also used in the "verify-run-console-output" step
  CurrentCommand.set(processor)
  await processor.waitForEnd()
  action.log(processor.output.fullText())
  if (processor.exitCode !== 0) {
    throw new Error(`command "${commandsToRun}" failed with exit code ${processor.exitCode}`)
  }
}
