import color from "colorette"
import { addCommand } from "./commands/add"
import { debugCommand } from "./commands/debug"
import { dynamicCommand } from "./commands/dynamic"
import { helpCommand } from "./commands/help"
import { runCommand } from "./commands/run"
import { setupCommand } from "./commands/setup"
import { staticCommand } from "./commands/static"
import { unusedCommand } from "./commands/unused"
import { versionCommand } from "./commands/version"
import { determineConfigFilename } from "./configuration/config-file/determine-config-filename"
import { loadConfigFile } from "./configuration/config-file/load-config-file"
import { determineConfiguration } from "./configuration/determine-configuration"
import { Configuration } from "./configuration/types/configuration"
import { UserProvidedConfiguration } from "./configuration/types/user-provided-configuration"

/**
 * Tests the documentation in the given directory
 * @param cmdLineArgs the arguments provided on the command line
 */
export async function textRunner(cmdlineArgs: UserProvidedConfiguration): Promise<Error[]> {
  let configuration: Configuration | undefined
  try {
    const configFilePath = await determineConfigFilename(cmdlineArgs)
    const configFileData = loadConfigFile(configFilePath)
    configuration = determineConfiguration(configFileData, cmdlineArgs)
    const commandName = cmdlineArgs.command
    let errors: Error[]
    switch (commandName) {
      case "add":
        errors = await addCommand(cmdlineArgs.fileGlob)
        return errors
      case "debug":
        errors = await debugCommand(configuration)
        return errors
      case "dynamic":
        errors = await dynamicCommand(configuration)
        return errors
      case "help":
        await helpCommand()
        return []
      case "run":
        errors = await runCommand(configuration)
        return errors
      case "setup":
        await setupCommand()
        return []
      case "static":
        errors = await staticCommand(configuration)
        return errors
      case "unused":
        await unusedCommand(configuration)
        return []
      case "version":
        await versionCommand()
        return []
      default:
        console.log(color.red(`unknown command: ${commandName || ""}`))
        return []
    }
  } catch (err) {
    if (configuration && configuration.sourceDir) {
      process.chdir(configuration.sourceDir)
    }
    return [err]
  }
}
