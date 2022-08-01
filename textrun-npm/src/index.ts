import * as tr from "text-runner"

import { exportedExecutable } from "./actions/exported-executable"
import { install } from "./actions/install"
import { installedExecutable } from "./actions/installed-executable"

export const textrunActions: tr.exports.TextrunActions = {
  exportedExecutable,
  install,
  installedExecutable,
}
