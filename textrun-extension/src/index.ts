import { runTextrunner } from "./actions/run-textrunner"
import { runBlock } from "./actions/run-block"
import { callArgs } from "./helpers/call-args"

const textrunActions = { runBlock, runTextrunner }

export { callArgs, textrunActions }
