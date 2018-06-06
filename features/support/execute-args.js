// @flow

const Formatter = require('../../src/formatters/formatter.js')

export type ExecuteArgs = {
  command: string,
  file: string,
  format: Formatter,
  offline: boolean,
  expectError: boolean
}
