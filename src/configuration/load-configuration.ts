import { DetailedFormatter } from '../formatters/detailed-formatter'
import { Configuration } from './configuration'
import { getFormatterClass } from './get-formatter-class'
import { Publications } from './publications'
import { UserProvidedConfiguration } from './user-provided-configuration'

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

/**
 * Loads the configuration from disk and returns it.
 *
 * @param configFilePath path of the config file
 * @param cmdlineArgs arguments received on the command line
 */
export function loadConfiguration(
  configFileData: UserProvidedConfiguration,
  cmdlineArgs: UserProvidedConfiguration
): Configuration {
  // merge the configs
  const result = {}
  for (const key of Object.keys(defaultValues)) {
    if (cmdlineArgs[key] != null) {
      result[key] = cmdlineArgs[key]
    } else if (configFileData[key] != null) {
      result[key] = configFileData[key]
    } else {
      result[key] = defaultValues[key]
    }
  }
  result['FormatterClass'] = getFormatterClass(
    result['formatterName'],
    defaultValues.FormatterClass
  )
  result['publications'] = Publications.fromJSON(
    result['publications']
  ).sorted()
  delete result['formatterName']
  return result as Configuration
}
