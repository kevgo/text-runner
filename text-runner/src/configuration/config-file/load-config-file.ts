import * as YAML from "yamljs"
import { UserProvidedConfiguration } from "../types/user-provided-configuration"

/** provides the content of the config file in the standardized format */
export function loadConfigFile(filename: string): UserProvidedConfiguration {
  if (!filename) {
    return {}
  }
  const fileData = YAML.load(filename)
  const result: UserProvidedConfiguration = {
    actions: fileData.actions,
    regionMarker: fileData.regionMarker,
    defaultFile: fileData.defaultFile,
    exclude: fileData.exclude,
    fileGlob: fileData.files,
    formatterName: fileData.format,
    keepWorkspace: fileData.keepWorkspace,
    offline: fileData.offline,
    publications: fileData.publications,
    useSystemTempDirectory: fileData.useSystemTempDirectory,
    workspace: fileData.workspace,
  }
  return result
}
