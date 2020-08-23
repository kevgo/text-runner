import { command } from "./actions/command"
import { commandOutput } from "./actions/command-output"
import { commandWithInput } from "./actions/command-with-input"
import { serverOutput } from "./actions/server-output"
import { server } from "./actions/server"
import { stopServer } from "./actions/stop-server"

export const textrunActions = {
  command,
  commandOutput,
  commandWithInput,
  serverOutput,
  server,
  stopServer,
}
