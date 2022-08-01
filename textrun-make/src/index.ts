import * as tr from "text-runner"

import { command } from "./actions/command"
import { target } from "./actions/target"

export const textrunActions: tr.export.TextrunActions = {
  command,
  target,
}
