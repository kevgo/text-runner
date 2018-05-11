// @flow

import Formatter from '../formatters/formatter.js'

export type CliArgTypes = {
  command: string,
  exclude?: string,
  files?: string,
  format?: Formatter,
  offline?: boolean
}
