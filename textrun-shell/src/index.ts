import { command } from "./actions/command"
import { commandOutput } from "./actions/command-output"
import { commandWithInput } from "./actions/command-with-input"
import { serverOutput } from "./actions/server-output"
import { server } from "./actions/server"
import { stop } from "./actions/stop"

export const textrunActions = {
  command,
  commandOutput,
  commandWithInput,
  serverOutput,
  server,
  stop,
}
