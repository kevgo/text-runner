import YAML from 'yamljs'
import { UserProvidedConfiguration } from '../cli/cmdline-args'

/** provides the content of the config file in the standardized format */
export function loadConfigFile(filename: string): UserProvidedConfiguration {
  if (!filename) {
    return {}
  }
  const fileData = YAML.load(filename)
  const result: UserProvidedConfiguration = {
    actions: fileData.actions,
    exclude: fileData.exclude,
    fileGlob: fileData.files,
    formatterName: fileData.formatter,
    keepTmp: fileData.keepTmp,
    offline: fileData.offline,
    workspace: fileData.workspace
  }
  return result
}
