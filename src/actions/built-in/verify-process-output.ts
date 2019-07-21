import { ActionArgs } from "../action-args"
import { RunningProcess } from "./helpers/running-process"

// Waits until the currently running console command produces the given output
export default async function verifyProcessOutput(args: ActionArgs) {
  args.name("verifying the output of the long-running process")
  const expectedOutput = args.nodes.textInNodeOfType("fence")
  const expectedLines = expectedOutput
    .split("\n")
    .map(line => line.trim())
    .filter(line => line)
  const process = RunningProcess.instance().process
  if (!process) {
    throw new UnprintedUserError(
      "Cannot verify process output since no process has been started",
      args.file,
      args.line
    )
  }
  for (const line of expectedLines) {
    args.log(`waiting for ${line}`)
    await process.output.waitForText(line)
  }
}
