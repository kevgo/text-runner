import color from "colorette"
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
  const config = await Configuration.load("textrun-shell.js")
  const globalizePath = config.pathMapper().globalizePathFunc()
  const commandsToRun = args.nodes
    .text()
    .split("\n")
    .map((command: string) => command.trim())
    .filter((command: string) => command.length > 0)
    // TODO: move this one line up
    .map(trimDollar)
    .map(globalizePath)
    .join(" && ")
  if (commandsToRun === "") {
    throw new Error(
      `the <${args.nodes[0].tag} ${args.configuration.classPrefix}="exec"> block contains no commands to run`
    )
  }
  args.name(`running console command: ${color.cyan(commandsToRun)}`)
  const processor = createObservableProcess(callArgs(commandsToRun), {
    cwd: args.configuration.workspace,
  })
  // this is also used in the "verify-run-console-output" step
  CurrentCommand.set(processor)
  await processor.waitForEnd()
  if (processor.exitCode !== 0) {
    console.log(processor.output.fullText())
    throw new Error(`command "${commandsToRun}" failed with exit code ${processor.exitCode}`)
  }
}
