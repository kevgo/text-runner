import * as color from "colorette"
import * as path from "path"
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
    const configFilePath = path.join(cmdLineArgs.sourceDir || ".", cmdLineArgs.configFileName)
    try {
      await fs.stat(configFilePath)
      return configFilePath
    } catch (e) {
      console.log(color.red(`configuration file ${color.cyan(configFilePath)} not found`))
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
