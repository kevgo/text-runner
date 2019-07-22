import { ActionArgs } from "./action-args"
import { ActionResult } from "./action-result"

/**
 * A user-defined or built-in function that tests an active block
 */
export type Action = (params: ActionArgs) => ActionResult
