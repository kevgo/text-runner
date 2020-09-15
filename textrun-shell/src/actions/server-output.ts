import { CurrentServer } from "../helpers/current-server"
import { ActionArgs } from "@text-runner/core"

/**
 * The "start-output" action waits until the currently running console command
 * produces the given output.
 */
export async function serverOutput(action: ActionArgs) {
  action.name("verifying the output of the long-running process")
  const expectedOutput = action.region.textInNodeOfType("fence")
  const expectedLines = expectedOutput
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line)
  const process = CurrentServer.instance().process
  if (!process) {
    throw new Error("Cannot verify process output since no process has been started")
  }
  for (const line of expectedLines) {
    action.log(`waiting for output: ${line}`)
    await process.output.waitForText(line)
  }
  action.log(process.output.fullText())
}
