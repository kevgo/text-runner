import { promises as fs } from "fs"
import { UserProvidedConfiguration } from "../types/user-provided-configuration"
import { UserError } from "../../errors/user-error"

/**
 * Returns the filename for the config file
 *
 * @param cmdLineArgs
 */
export async function determineConfigFilename(cmdLineArgs: UserProvidedConfiguration): Promise<string> {
  if (cmdLineArgs.configFileName) {
    try {
      await fs.stat(cmdLineArgs.configFileName)
      return cmdLineArgs.configFileName
    } catch (e) {
      throw new UserError(`configuration file "${cmdLineArgs.configFileName}" not found`)
    }
  }

  try {
    await fs.stat("text-run.yml")
    return "text-run.yml"
  } catch (e) {
    return ""
  }
}
