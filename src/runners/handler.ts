import { ActionArgs } from './action-args'

/**
 * A user-defined or built-in function that executes an action
 */
export type Handler = (params: ActionArgs) => void
