// @flow

import type {Activity} from '../commands/run/activity.js'
import type Configuration from '../configuration/configuration.js'
import type Formatter from '../formatters/formatter.js'
import type Searcher from '../commands/run/searcher.js'

// A user-defined or built-in handler for a code block
export type HandlerFunction = (value: Activity) => void
