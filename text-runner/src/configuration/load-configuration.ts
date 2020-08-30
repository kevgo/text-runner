import { UserProvidedConfiguration } from "./types/user-provided-configuration"
import { determineConfigFilename } from "./config-file/determine-config-filename"
import { loadConfigFile } from "./config-file/load-config-file"
import { determineConfiguration } from "./determine-configuration"
import { Configuration } from "./types/configuration"

export async function loadConfiguration(cmdlineArgs: UserProvidedConfiguration): Promise<Configuration> {
  const configFilePath = await determineConfigFilename(cmdlineArgs)
  const configFileData = loadConfigFile(configFilePath)
  return determineConfiguration(configFileData, cmdlineArgs)
}
