// @flow

import type Configuration from '../configuration.js'
import type Formatter from '../formatters/formatter.js'
import type Searcher from '../commands/run/searcher.js'

// A user-defined or built-in handler for a code block
export type Action = (value: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) => void
