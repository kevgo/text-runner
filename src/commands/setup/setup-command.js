// @flow

import type Configuration from '../../configuration/configuration.js'
import type Formatter from '../../formatters/formatter.js'

const { cyan } = require('chalk')

module.exports = async function (config: Configuration, format: Formatter) {
  format.startActivity(
    `Create configuration file ${cyan('text-run.yml')} with default values`
  )
  config.createDefault()
  format.success()
}
