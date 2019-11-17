import { endChildProcesses } from "end-child-processes"
import { RunningProcess } from "../helpers/running-process"
import { ActionArgs } from "../types/action-args"

/**
 * The "stopProcess" action stops the currently running console command,
 * started by the "startProcess" action.
 */
export default async function stopProcess(args: ActionArgs) {
  args.name("stopping the long-running process")
  if (!RunningProcess.instance().hasProcess()) {
    throw new Error("No running process found")
  }
  RunningProcess.instance().kill()
  await endChildProcesses()
  RunningProcess.instance().reset()
}
