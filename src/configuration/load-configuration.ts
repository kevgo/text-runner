import { CliArgTypes } from '../cli/cli-arg-types'
import { Configuration } from './configuration'

import deb from 'debug'
import camelCase from 'just-camel-case'
import YAML from 'yamljs'
import DetailedFormatter from '../formatters/detailed-formatter'
import getFormatterClass from './get-formatter-class'
import Publications from './publications'

const debug = deb('textrun:configuration')

const defaultValues: Configuration = {
  FormatterClass: DetailedFormatter,
  actions: {},
  classPrefix: 'textrun',
  defaultFile: '',
  exclude: [],
  fileGlob: '**/*.md',
  keepTmp: false,
  offline: false,
  publications: new Publications(),
  sourceDir: process.cwd(),
  useSystemTempDirectory: false,
  workspace: '' // will be populated later
}

// Reads documentation and
export default function loadConfiguration(
  configFilePath: string,
  constructorArgs: CliArgTypes
): Configuration {
  let fileData: any = {}
  if (configFilePath) {
    debug(`loading configuration file: ${configFilePath}`)
    fileData = YAML.load(configFilePath) || {}
  }
  debug(`configuration file data: ${JSON.stringify(this.fileData)}`)

  function get(attributeName: string): string {
    const camelized = camelCase(attributeName)
    return (
      constructorArgs[attributeName] ||
      fileData[camelized] ||
      defaultValues[camelized]
    )
  }

  return {
    FormatterClass: getFormatterClass(
      get('format'),
      defaultValues.FormatterClass
    ),
    actions: fileData.actions ? fileData.actions : defaultValues.actions,
    classPrefix: get('class-prefix'),
    defaultFile: get('default-file'),
    exclude: get('exclude'),
    fileGlob: get('files') || defaultValues.fileGlob,
    keepTmp: String(get('keep-tmp')) === 'true',
    offline: String(get('offline')) === 'true',
    publications:
      Publications.fromJSON(fileData.publications || []).sorted() ||
      defaultValues.publications,
    sourceDir: get('source-dir'),
    useSystemTempDirectory: String(get('use-system-temp-directory')) === 'true',
    workspace: get('workspace') || ''
  }
}
