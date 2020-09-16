import * as YAML from "yamljs"
import { promises as fs } from "fs"
import { UserProvidedConfiguration } from "../config/user-provided-configuration"

/** provides the content of the config file in the standardized format */
export async function loadConfigFile(filename: string): Promise<UserProvidedConfiguration> {
  if (!filename) {
    return {}
  }
  const fileContent = await fs.readFile(filename, "utf-8")
  const fileData = YAML.parse(fileContent)
  const result: UserProvidedConfiguration = {
    regionMarker: fileData.regionMarker,
    defaultFile: fileData.defaultFile,
    exclude: fileData.exclude,
    files: fileData.files,
    formatterName: fileData.format,
    online: fileData.online,
    publications: fileData.publications,
    systemTmp: fileData.systemTmp,
    workspace: fileData.workspace,
  }
  return result
}
