import * as path from "path"
import { promises as fs } from "fs"
import * as tr from "text-runner-core"
import { Configuration } from "../user-provided-configuration"

/**
 * Returns the filename for the config file
 *
 * @param cmdLineArgs
 */
export async function determineConfigFilename(cmdLineArgs: Configuration): Promise<string> {
  if (cmdLineArgs.configFileName) {
    const configFilePath = path.join(cmdLineArgs.sourceDir || ".", cmdLineArgs.configFileName)
    try {
      await fs.stat(configFilePath)
      return configFilePath
    } catch (e) {
      throw new tr.UserError(`configuration file '${cmdLineArgs.configFileName}' not found`)
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
