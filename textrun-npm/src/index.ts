import * as tr from "text-runner"

import { exportedExecutable } from "./actions/exported-executable.js"
import { install } from "./actions/install.js"
import { installedExecutable } from "./actions/installed-executable.js"

export const textrunActions: tr.exports.TextrunActions = {
  exportedExecutable,
  install,
  installedExecutable,
}
