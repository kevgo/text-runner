// @flow

import type { CliArgTypes } from '../cli/cli-arg-types.js'
import type { Configuration } from './configuration.js'

const camelCase = require('just-camel-case')
const DetailedFormatter = require('../formatters/detailed-formatter.js')
const getFormatterClass = require('./get-formatter-class.js')
const debug = require('debug')('textrun:configuration')
const YAML = require('yamljs')

const defaultValues: Configuration = {
  actions: {},
  classPrefix: 'textrun',
  exclude: [],
  fileGlob: '**/*.md',
  keepTmp: false,
  FormatterClass: DetailedFormatter,
  offline: false,
  sourceDir: process.cwd(),
  useSystemTempDirectory: false,
  workspace: '' // will be populated later
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
    const camelized = camelCase(attributeName)
    return (
      constructorArgs[attributeName] ||
      fileData[camelized] ||
      defaultValues[camelized]
    )
  }

  return {
    actions: fileData['actions']
      ? fileData['actions']
      : defaultValues['actions'],
    classPrefix: get('class-prefix'),
    exclude: get('exclude'),
    fileGlob: get('files') || defaultValues.fileGlob,
    keepTmp: String(get('keep-tmp')) === 'true',
    FormatterClass: getFormatterClass(
      get('format'),
      defaultValues.FormatterClass
    ),
    offline: String(get('offline')) === 'true',
    sourceDir: get('source-dir'),
    useSystemTempDirectory: String(get('use-system-temp-directory')) === 'true',
    workspace: get('workspace') || ''
  }
}
