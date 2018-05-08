// @flow

import type { ActionArgs } from './action-args.js'

// A user-defined or built-in function that executes an activity
export type Action = (params: ActionArgs) => void
