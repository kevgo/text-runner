import * as tr from "text-runner"

import { command } from "./actions/command.js"
import { commandOutput } from "./actions/command-output.js"
import { commandWithInput } from "./actions/command-with-input.js"
import { server } from "./actions/server.js"
import { serverOutput } from "./actions/server-output.js"
import { stopServer } from "./actions/stop-server.js"

export const textrunActions: tr.exports.TextrunActions = {
  command,
  commandOutput,
  commandWithInput,
  serverOutput,
  server,
  stopServer,
}
