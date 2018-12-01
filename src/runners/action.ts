import { ActionArgs } from './action-args'

// A user-defined or built-in function that executes an activity
export type Action = (params: ActionArgs) => void
