import * as textRunner from "text-runner"

import { command } from "./actions/command.js"
import { target } from "./actions/target.js"

export const textrunActions: textRunner.exports.TextrunActions = {
  command,
  target,
}
