import * as textRunner from "text-runner"

import { nonRunnable } from "./actions/non-runnable.js"
import { runAsFile } from "./actions/run-as-file.js"
import { runnable } from "./actions/runnable.js"

export const textrunActions: textRunner.exports.TextrunActions = {
  nonRunnable,
  runAsFile,
  runnable
}
