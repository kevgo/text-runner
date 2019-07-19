import { DetailedFormatter } from '../formatters/detailed-formatter'
import { Configuration } from './configuration'
import { determineConfigFilename } from './determine-config-filename'
import { getFormatterClass } from './get-formatter-class'
import { loadConfigFile } from './load-config-file'
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
export async function loadConfiguration(
  cmdlineArgs: UserProvidedConfiguration
): Promise<Configuration> {
  const configFilePath = await determineConfigFilename(cmdlineArgs)
  const fileData = loadConfigFile(configFilePath)
  const userProvided = { ...fileData, ...cmdlineArgs }

  function get(attributeName: string): string {
    if (userProvided[attributeName] != null) {
      return userProvided[attributeName]
    }
    return defaultValues[attributeName]
  }

  function getB(attributeName: string): boolean {
    if (userProvided[attributeName] != null) {
      return userProvided[attributeName]
    }
    return defaultValues[attributeName]
  }

  return {
    FormatterClass: getFormatterClass(
      get('format'),
      defaultValues.FormatterClass
    ),
    actions: get('actions'),
    classPrefix: get('classPrefix'),
    defaultFile: get('defaultFile'),
    exclude: get('exclude'),
    fileGlob: get('fileGlob'),
    keepTmp: getB('keepTmp'),
    offline: getB('offline'),
    publications:
      Publications.fromJSON(fileData.publications || []).sorted() ||
      defaultValues.publications,
    sourceDir: get('sourceDir'),
    useSystemTempDirectory: getB('useSystemTempDirectory'),
    workspace: get('workspace')
  }
}
