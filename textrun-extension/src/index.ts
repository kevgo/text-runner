import { runTextrunner } from "./actions/run-textrunner"
import { runnableRegion } from "./actions/runnable-region"
import { callArgs } from "./helpers/call-args"

const textrunActions = { runnableRegion, runTextrunner }

export { callArgs, textrunActions }
