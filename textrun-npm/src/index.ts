import * as textRunner from "text-runner"

import { exportedExecutable } from "./actions/exported-executable.js"
import { install } from "./actions/install.js"
import { installedExecutable } from "./actions/installed-executable.js"
import { scriptName } from "./actions/script-name.js"
import { scriptCall } from "./actions/script-call.js"

export const textrunActions: textRunner.exports.TextrunActions = {
  exportedExecutable,
  install,
  installedExecutable,
  scriptName,
  scriptCall
}
