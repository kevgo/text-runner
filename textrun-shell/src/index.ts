import * as textRunner from "text-runner"

import { commandOutput } from "./actions/command-output.js"
import { commandWithInput } from "./actions/command-with-input.js"
import { command } from "./actions/command.js"
import { serverOutput } from "./actions/server-output.js"
import { server } from "./actions/server.js"
import { stopServer } from "./actions/stop-server.js"

export const textrunActions: textRunner.exports.TextrunActions = {
  command,
  commandOutput,
  commandWithInput,
  server,
  serverOutput,
  stopServer
}
