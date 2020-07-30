import color from "colorette"
import { createObservableProcess } from "observable-process"
import { callArgs } from "../helpers/call-args"
import { CurrentCommand } from "../helpers/current-command"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs } from "text-runner"

/**
 * Runs the given commands synchronously on the console.
 */
export async function exec(args: ActionArgs) {
  const content = args.nodes.text()
  const commandsToRun = content
    .split("\n")
    .map((command: string) => command.trim())
    .filter((e: string) => e)
    .map(trimDollar)
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
  args.log(processor.output.fullText())
}
