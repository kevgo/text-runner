// @flow

const Configuration = require('../src/configuration.js')
const Formatter = require('../src/formatters/formatter.js')
const Searcher = require('../src/commands/run/searcher.js')

// A user-defined or built-in handler for a code block
declare type Action = (value: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) => void
