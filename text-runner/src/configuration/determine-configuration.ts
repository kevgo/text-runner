import { mergeConfigurations } from "./merge-configurations"
import { Publications } from "./publications/publications"
import { Configuration } from "./types/configuration"
import { UserProvidedConfiguration } from "./types/user-provided-configuration"

const defaultValues: Configuration = {
  actions: {},
  regionMarker: "textrun",
  defaultFile: "",
  exclude: [],
  fileGlob: "**/*.md",
  formatterName: "detailed",
  keepWorkspace: false,
  offline: false,
  publications: new Publications(),
  sourceDir: process.cwd(),
  useSystemTempDirectory: false,
  workspace: "", // will be populated later
}

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
  const result = mergeConfigurations(cmdlineArgs, configFileData, defaultValues)
  result["publications"] = Publications.fromJSON(result["publications"]).sorted()
  return result as Configuration
}
