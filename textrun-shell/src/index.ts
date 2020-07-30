import { exec } from "./actions/exec"
import { execOutput } from "./actions/exec-output"
import { execWithInput } from "./actions/exec-with-input"
import { serverOutput } from "./actions/server-output"
import { start } from "./actions/start"
import { stop } from "./actions/stop"

export const textrunActions = {
  exec,
  execOutput,
  execWithInput,
  serverOutput,
  start,
  stop,
}
