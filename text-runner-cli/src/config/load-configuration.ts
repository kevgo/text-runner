import { determineConfiguration } from "./determine-configuration"
import { UserProvidedConfiguration } from "./user-provided-configuration"
import * as tr from "text-runner-core"
import { determineConfigFilename } from "../config-file/determine-config-filename"
import { loadConfigFile } from "../config-file/load-config-file"

export async function loadConfiguration(cmdlineArgs: UserProvidedConfiguration): Promise<UserProvidedConfiguration> {
  const configFilePath = await determineConfigFilename(cmdlineArgs)
  const configFileData = await loadConfigFile(configFilePath)
  return determineConfiguration(configFileData, cmdlineArgs)
}
