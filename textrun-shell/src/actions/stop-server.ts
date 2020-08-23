import { endChildProcesses } from "end-child-processes"
import { CurrentServer } from "../helpers/current-server"
import { ActionArgs } from "text-runner"

/**
 * The "stop" action stops the currently running server process,
 * started by the "start" action.
 */
export async function stopServer(action: ActionArgs) {
  action.name("stopping the long-running process")
  if (!CurrentServer.instance().hasProcess()) {
    throw new Error("No running process found")
  }
  CurrentServer.instance().kill()
  await endChildProcesses()
  CurrentServer.instance().reset()
}
