import * as observableProcess from "observable-process"

import { TRWorld } from "../world.js"
import { makeFullPath } from "./make-full-path.js"

/** Executes the given command in a subshell. */
export async function executeCLI(
  command: string,
  expectError: boolean,
  world: TRWorld,
  opts: { cwd?: string } = {}
): Promise<observableProcess.FinishedProcess> {
  const args: observableProcess.StartOptions = {}
  args.cwd = opts.cwd || world.workspace.platformified()
  if (world.debug) {
    args.env = {
      DEBUG: "*,-babel",
      PATH: process.env.PATH,
    }
  }
  const fullCommand = makeFullPath(command, process.platform)
  const runner = observableProcess.start(fullCommand, args)
  const runResult = (await runner.waitForEnd()) as observableProcess.FinishedProcess
  if (runResult.exitCode && !expectError) {
    // unexpected failure
    console.log(runner.output.fullText())
    throw new Error(`Expected success but got exit code: ${runResult.exitCode}`)
  }
  if (expectError && !runResult.exitCode) {
    // expected failure didn't occur
    throw new Error("expected error but test succeeded")
  }
  return runResult
}
