import { mergeConfigurations } from "./merge-configurations"
import { Publications } from "./publications/publications"
import { Configuration, defaultConfiguration } from "./types/configuration"
import { UserProvidedConfiguration } from "./types/user-provided-configuration"

/**
 * Loads the configuration from disk and returns it.
 *
 * @param configFilePath path of the config file
 * @param cmdlineArgs arguments received on the command line
 */
export function determineConfiguration(
  configFileData: UserProvidedConfiguration,
  cmdlineArgs: UserProvidedConfiguration
): Configuration {
  // merge the configs
  const result = mergeConfigurations(cmdlineArgs, configFileData, defaultConfiguration())
  result.publications = Publications.fromJSON(result.publications).sorted()
  return result as Configuration
}
