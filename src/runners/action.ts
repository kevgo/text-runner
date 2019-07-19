import { ActionArgs } from "./action-args"

/**
 * A user-defined or built-in function that tests an active block
 */
export type Action = (params: ActionArgs) => void
