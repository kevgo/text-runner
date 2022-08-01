import * as tr from "text-runner-core"

import { nonRunnable } from "./actions/non-runnable"
import { runnable } from "./actions/runnable"

export const textrunActions: tr.export.TextrunActions = {
  runnable,
  nonRunnable,
}
