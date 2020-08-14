import * as color from "colorette"
import * as path from "path"
import { createObservableProcess } from "observable-process"
import { callArgs } from "../helpers/call-args"
import { CurrentCommand } from "../helpers/current-command"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs } from "text-runner"
import { Configuration } from "../helpers/configuration"

/**
 * Runs the given commands synchronously on the console.
 */
export async function exec(args: ActionArgs) {
  const config = await Configuration.load(path.join(args.configuration.sourceDir, "textrun-shell.js"))
  const commandsToRun = args.nodes
    .text()
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0)
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
  const processor = createObservableProcess(callArgs(commandsToRun), {
    cwd: args.configuration.workspace,
  })
  // this is also used in the "verify-run-console-output" step
  CurrentCommand.set(processor)
  await processor.waitForEnd()
  args.log(processor.output.fullText())
  if (processor.exitCode !== 0) {
    throw new Error(`command "${commandsToRun}" failed with exit code ${processor.exitCode}`)
  }
}
