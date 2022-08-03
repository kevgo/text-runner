import * as tr from "text-runner"

import { nonRunnable } from "./actions/non-runnable.js"
import { runnable } from "./actions/runnable.js"

export const textrunActions: tr.exports.TextrunActions = {
  runnable,
  nonRunnable,
}
