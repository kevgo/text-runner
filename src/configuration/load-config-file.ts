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
    defaultFile: fileData.defaultFile,
    exclude: fileData.exclude,
    fileGlob: fileData.files,
    formatterName: fileData.formatter,
    keepTmp: fileData.keepTmp,
    offline: fileData.offline,
    publications: fileData.publications,
    workspace: fileData.workspace
  }
  return result
}
