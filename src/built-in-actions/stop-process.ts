import { endChildProcesses } from "end-child-processes"
import { ActionArgs } from "../runners/action-args"
import { RunningProcess } from "./helpers/running-process"

// Stops the currently running console command.
export default async function stopProcess(args: ActionArgs) {
  args.formatter.name("stopping the long-running process")
  if (!RunningProcess.instance().hasProcess()) {
    throw new Error("No running process found")
  }
  RunningProcess.instance().kill()
  await endChildProcesses()
  RunningProcess.instance().reset()
}
