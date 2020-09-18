import { UserProvidedConfiguration } from "./user-provided-configuration"
import { determineConfigFilename } from "../config-file/determine-config-filename"
import { loadConfigFile } from "../config-file/load-config-file"

/** loads configuration from text-run.yml */
export async function loadConfiguration(cmdlineArgs: UserProvidedConfiguration): Promise<UserProvidedConfiguration> {
  const configFilePath = await determineConfigFilename(cmdlineArgs)
  const configFileData = await loadConfigFile(configFilePath)
  return configFileData
}