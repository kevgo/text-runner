import { exec } from "./actions/exec"
import { execOutput } from "./actions/exec-output"
import { serverOutput } from "./actions/server-output"
import { start } from "./actions/start"
import { stop } from "./actions/stop"

export const textrunActions = {
  exec,
  execOutput,
  serverOutput,
  start,
  stop,
}
