import { mergeConfigurations } from "./merge-configurations"
import * as tr from "text-runner-core"
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
): tr.Configuration {
  // merge the configs
  const result = mergeConfigurations(cmdlineArgs, configFileData, defaultConfiguration())
  result.publications = tr.Publications.fromJSON(result.publications).sorted()
  return result as tr.Configuration
}
