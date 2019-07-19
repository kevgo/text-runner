import YAML from 'yamljs'
import { UserProvidedConfiguration } from './user-provided-configuration'

/** provides the content of the config file in the standardized format */
export function loadConfigFile(filename: string): UserProvidedConfiguration {
  if (!filename) {
    return {}
  }
  const fileData = YAML.load(filename)
  const result: UserProvidedConfiguration = {
    actions: fileData.actions,
    classPrefix: fileData.classPrefix,
    exclude: fileData.exclude,
    fileGlob: fileData.files,
    formatterName: fileData.formatter,
    keepTmp: fileData.keepTmp,
    offline: fileData.offline,
    workspace: fileData.workspace
  }
  return result
}
