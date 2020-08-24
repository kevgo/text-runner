import * as color from "colorette"
import { debugCommand } from "./commands/debug"
import { dynamicCommand } from "./commands/dynamic"
import { helpCommand } from "./commands/help"
import { runCommand } from "./commands/run"
import { scaffoldCommand } from "./commands/scaffold"
import { setupCommand } from "./commands/setup"
import { staticCommand } from "./commands/static"
import { unusedCommand } from "./commands/unused"
import { versionCommand } from "./commands/version"
import { determineConfigFilename } from "./configuration/config-file/determine-config-filename"
import { loadConfigFile } from "./configuration/config-file/load-config-file"
import { determineConfiguration } from "./configuration/determine-configuration"
import { Configuration } from "./configuration/types/configuration"
import { UserProvidedConfiguration } from "./configuration/types/user-provided-configuration"

export type Commands = "debug" | "dynamic" | "help" | "run" | "scaffold" | "setup" | "static" | "unused" | "version"

/**
 * Tests the documentation in the given directory
 * @param cmdLineArgs the arguments provided on the command line
 */
export async function textRunner(cmdlineArgs: UserProvidedConfiguration): Promise<Error[]> {
  let configuration: Configuration | undefined
  try {
    let errors: Error[]
    switch (cmdlineArgs.command) {
      case "help":
        await helpCommand()
        return []
      case "scaffold":
        errors = await scaffoldCommand(cmdlineArgs.fileGlob)
        return errors
      case "setup":
        await setupCommand()
        return []
      case "version":
        await versionCommand()
        return []
    }
    const configFilePath = await determineConfigFilename(cmdlineArgs)
    const configFileData = loadConfigFile(configFilePath)
    configuration = determineConfiguration(configFileData, cmdlineArgs)
    switch (cmdlineArgs.command) {
      case "debug":
        errors = await debugCommand(configuration)
        return errors
      case "dynamic":
        errors = await dynamicCommand(configuration)
        return errors
      case "run":
        errors = await runCommand(configuration)
        return errors
      case "static":
        errors = await staticCommand(configuration)
        return errors
      case "unused":
        await unusedCommand(configuration)
        return []
      default:
        console.log(color.red(`unknown command: ${cmdlineArgs.command || ""}`))
        return []
    }
  } catch (err) {
    if (configuration && configuration.sourceDir) {
      process.chdir(configuration.sourceDir)
    }
    return [err]
  }
}

export type { ActionArgs } from "./actions/types/action-args"
export type { Configuration } from "./configuration/types/configuration"
export { AstNode } from "./parsers/standard-AST/ast-node"
export { AstNodeList } from "./parsers/standard-AST/ast-node-list"
export { actionName } from "./actions/helpers/action-name"
