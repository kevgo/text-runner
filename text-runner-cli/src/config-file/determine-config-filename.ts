import * as path from "path"
import { promises as fs } from "fs"
import { UserError } from "text-runner-core"
import { UserProvidedConfiguration } from "../config/user-provided-configuration"

/**
 * Returns the filename for the config file
 *
 * @param cmdLineArgs
 */
export async function determineConfigFilename(cmdLineArgs: UserProvidedConfiguration): Promise<string> {
  if (cmdLineArgs.configFileName) {
    const configFilePath = path.join(cmdLineArgs.sourceDir || ".", cmdLineArgs.configFileName)
    try {
      await fs.stat(configFilePath)
      return configFilePath
    } catch (e) {
      throw new UserError(`configuration file '${cmdLineArgs.configFileName}' not found`)
    }
  }
  try {
    const configFilePath = path.join(cmdLineArgs.sourceDir || ".", "text-run.yml")
    await fs.stat(configFilePath)
    return configFilePath
  } catch (e) {
    return ""
  }
}
