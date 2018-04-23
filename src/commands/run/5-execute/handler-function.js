// @flow

import type { Activity } from '../4-activities/activity.js'

// A user-defined or built-in handler for a code block
export type HandlerFunction = (value: Activity) => void
