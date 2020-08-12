import { exec } from "./actions/exec"
import { execOutput } from "./actions/exec-output"
import { execWithInput } from "./actions/exec-with-input"
import { startOutput } from "./actions/start-output"
import { start } from "./actions/start"
import { stop } from "./actions/stop"

export const textrunActions = {
  exec,
  execOutput,
  execWithInput,
  startOutput,
  start,
  stop,
}
