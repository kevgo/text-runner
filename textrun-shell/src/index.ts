import { command } from "./actions/command"
import { commandOutput } from "./actions/command-output"
import { commandWithInput } from "./actions/command-with-input"
import { startOutput } from "./actions/start-output"
import { start } from "./actions/start"
import { stop } from "./actions/stop"

export const textrunActions = {
  exec: command,
  execOutput: commandOutput,
  execWithInput: commandWithInput,
  startOutput,
  start,
  stop,
}
