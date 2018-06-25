// @flow

import type { CliArgTypes } from '../cli/cli-arg-types.js'
import type { Configuration, Mapping } from './configuration.js'

const camelCase = require('just-camel-case')
const DetailedFormatter = require('../formatters/detailed-formatter.js')
const getFormatterClass = require('./get-formatter-class.js')
const debug = require('debug')('textrun:configuration')
const stripLeadingSlash = require('../helpers/strip-leading-slash.js')
const YAML = require('yamljs')

const defaultValues: Configuration = {
  actions: {},
  classPrefix: 'textrun',
  exclude: [],
  fileGlob: '**/*.md',
  keepTmp: false,
  linkFormat: 'direct',
  mappings: [],
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

  var mappings: Array<Mapping> = defaultValues.mappings
  if (fileData.mappings) {
    // $FlowFixMe: flow is too stupid to infer the proper return value from Object.entries
    mappings = Object.entries(fileData['mappings'])
  }
  mappings = mappings.sort(function (a, b) {
    return a[1] > b[1] ? -1 : 1
  })
  mappings.forEach(function (mapping) {
    mapping[0] = stripLeadingSlash(mapping[0])
    mapping[1] = stripLeadingSlash(mapping[1])
  })

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
    linkFormat: get('link-format'),
    mappings,
    offline: String(get('offline')) === 'true',
    sourceDir: get('source-dir'),
    useSystemTempDirectory: String(get('use-system-temp-directory')) === 'true',
    workspace: get('workspace') || ''
  }
}
