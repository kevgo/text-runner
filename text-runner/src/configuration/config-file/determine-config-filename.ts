import * as path from "path"
import { promises as fs } from "fs"
import { UserProvidedConfiguration } from "../types/user-provided-configuration"
import { UnprintedUserError } from "../../errors/unprinted-user-error"

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
      throw new UnprintedUserError(`configuration file '${cmdLineArgs.configFileName}' not found`)
    }
  }
  try {
    await fs.stat("text-run.yml")
    return "text-run.yml"
  } catch (e) {
    return ""
  }
}
