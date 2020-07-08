import color from "colorette"
import fs from "fs-extra"
import { PrintedUserError } from "../../errors/printed-user-error"
import { UserProvidedConfiguration } from "../types/user-provided-configuration"

/**
 * Returns the filename for the config file
 *
 * @param cmdLineArgs
 */
export async function determineConfigFilename(cmdLineArgs: UserProvidedConfiguration): Promise<string> {
  if (cmdLineArgs.configFileName == null) {
    try {
      await fs.stat("text-run.yml")
      return "text-run.yml"
    } catch (e) {
      return ""
    }
  }

  // TODO: move this to the top of the method
  try {
    await fs.stat(cmdLineArgs.configFileName)
    return cmdLineArgs.configFileName
  } catch (e) {
    console.log(color.red(`configuration file ${color.cyan(cmdLineArgs.configFileName)} not found`))
    throw new PrintedUserError()
  }
}
