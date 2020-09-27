import * as childProcess from "child_process"
import { createObservableProcess, ObservableProcess } from "observable-process"

import { TRWorld } from "../world"
import { makeFullPath } from "./make-full-path"

/**
 * Executes the given command in a subshell.
 * @param command the command to execute
 * @param expectError if true, fails if the command doesn't produce an error. If false, fails if the command produces an error.
 * @param world current Cucumber state
 * @param opts.cwd If given, runs the process in that directory, otherwise in world.rootDir
 */
export async function executeCLI(
  command: string,
  expectError: boolean,
  world: TRWorld,
  opts: { cwd?: string } = {}
): Promise<ObservableProcess> {
  const args: childProcess.SpawnOptions = {}
  args.cwd = opts.cwd || world.rootDir
  if (world.debug) {
    args.env = {
      DEBUG: "*,-babel",
      PATH: process.env.PATH,
    }
  }
  const fullCommand = makeFullPath(command, process.platform)
  const runner = createObservableProcess(fullCommand, args)
  await runner.waitForEnd()
  if (runner.exitCode && !expectError) {
    // unexpected failure
    console.log(runner.output.fullText())
    throw new Error(`Expected success but got exit code: ${runner.exitCode}`)
  }
  if (expectError && !runner.exitCode) {
    // expected failure didn't occur
    throw new Error("expected error but test succeeded")
  }
  return runner
}
