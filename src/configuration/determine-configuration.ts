import { mergeConfigurations } from "../helpers/merge-configurations"
import { Configuration } from "./configuration"
import { Publications } from "./publications/publications"
import { UserProvidedConfiguration } from "./user-provided-configuration"

const defaultValues: Configuration = {
  actions: {},
  classPrefix: "textrun",
  defaultFile: "",
  exclude: [],
  fileGlob: "**/*.md",
  formatterName: "detailed",
  keepTmp: false,
  offline: false,
  publications: new Publications(),
  sourceDir: process.cwd(),
  useSystemTempDirectory: false,
  workspace: "" // will be populated later
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
  result["publications"] = Publications.fromJSON(
    result["publications"]
  ).sorted()
  return result as Configuration
}
