// @flow

import Formatter from '../formatters/formatter.js'

export type CliArgTypes = {
  command: string,
  exclude?: string,
  file?: string,
  format?: Formatter,
  offline?: boolean
}
