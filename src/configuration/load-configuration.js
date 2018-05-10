// @flow

import type { CliArgTypes } from '../cli/cli-arg-types.js'
import type { Configuration } from './configuration.js'

const DetailedFormatter = require('../formatters/detailed-formatter.js')
const getFormatterClass = require('./get-formatter-class.js')
const debug = require('debug')('textrun:configuration')
const YAML = require('yamljs')

const defaultValues: Configuration = {
  offline: false,
  files: '**/*.md',
  exclude: [],
  FormatterClass: DetailedFormatter,
  useSystemTempDirectory: false,
  sourceDir: process.cwd(),
  workspace: '', // will be populated later
  classPrefix: 'textrun',
  activityTypes: {}
}

// Reads documentation and
module.exports = function loadConfiguration (
  configFilePath: string,
  constructorArgs: CliArgTypes
): Configuration {
  var fileData = {}
  if (configFilePath) {
    debug(`loading configuration file: ${configFilePath}`)
    // $FlowFixMe: flow-type defs seems to be wrong here
    fileData = YAML.load(configFilePath) || {}
  }
  debug(`configuration file data: ${JSON.stringify(this.fileData)}`)

  function get (attributeName: string): string {
    return (
      constructorArgs[attributeName] ||
      fileData[attributeName] ||
      defaultValues[attributeName]
    )
  }

  return {
    offline: get('offline') === 'true',
    files: get('files'),
    useSystemTempDirectory: get('useSystemTempDirectory') === true,
    classPrefix: get('classPrefix'),
    exclude: get('exclude'),
    workspace: '', // going to be populated later
    sourceDir: get('sourceDir'),
    activityTypes: fileData['activityTypes']
      ? JSON.parse(fileData['activityTypes'])
      : defaultValues['activityTypes'],
    FormatterClass: getFormatterClass(
      get('format'),
      defaultValues.FormatterClass
    )
  }
}
