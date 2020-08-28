import * as color from "colorette"
import { promises as fs } from "fs"
import { PrintedUserError } from "../../errors/printed-user-error"
import { UserProvidedConfiguration } from "../types/user-provided-configuration"

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
      console.log(color.red(`configuration file ${color.cyan(cmdLineArgs.configFileName)} not found`))
      throw new PrintedUserError()
    }
  }

  try {
    await fs.stat("text-run.yml")
    return "text-run.yml"
  } catch (e) {
    return ""
  }
}
