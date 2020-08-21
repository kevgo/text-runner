import { runTextrunner } from "./actions/run-textrunner"
import { runRegion } from "./actions/run-region"
import { callArgs } from "./helpers/call-args"

const textrunActions = { runRegion, runTextrunner }

export { callArgs, textrunActions }
