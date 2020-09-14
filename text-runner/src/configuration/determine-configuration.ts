import { mergeConfigurations } from "./merge-configurations"
import { Publications } from "./publications/publications"
import { Configuration } from "./configuration"
import { UserProvidedConfiguration } from "./user-provided-configuration"
import { defaultConfiguration } from "./default-configuration"

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
