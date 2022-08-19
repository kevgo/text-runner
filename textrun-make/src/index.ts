import * as tr from "text-runner"

import { command } from "./actions/command.js"
import { target } from "./actions/target.js"

export const textrunActions: tr.exports.TextrunActions = {
  command,
  target,
}
