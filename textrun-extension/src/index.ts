import { runTextrunner } from "./actions/run-textrunner.js"
import { runnableRegion } from "./actions/runnable-region.js"
import { callArgs } from "./helpers/call-args.js"

const textrunActions = { runnableRegion, runTextrunner }

export { callArgs, textrunActions }
