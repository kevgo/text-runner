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
import { Configuration } from "./configuration/types/configuration"
import { UserProvidedConfiguration } from "./configuration/types/user-provided-configuration"
import { loadConfiguration } from "./configuration/load-configuration"

export type Commands = "debug" | "dynamic" | "help" | "run" | "scaffold" | "setup" | "static" | "unused" | "version"

/**
 * Tests the documentation in the given directory
 * @param cmdLineArgs the arguments provided on the command line
 * @returns the number of documentation errors encountered
 * @throws developer errors
 */
export async function textRunner(cmdlineArgs: UserProvidedConfiguration): Promise<number> {
  let configuration: Configuration | undefined
  try {
    switch (cmdlineArgs.command) {
      case "help":
        await helpCommand()
        return 0
      case "scaffold":
        await scaffoldCommand(cmdlineArgs.fileGlob)
        return 0
      case "setup":
        await setupCommand()
        return 0
      case "version":
        await versionCommand()
        return 0
    }
    configuration = await loadConfiguration(cmdlineArgs)
    switch (cmdlineArgs.command) {
      case "debug":
        return await debugCommand(cmdlineArgs)
      case "dynamic":
        return await dynamicCommand(cmdlineArgs)
      case "run":
        return await runCommand(cmdlineArgs)
      case "static":
        return await staticCommand(configuration)
      case "unused":
        return await unusedCommand(configuration)
      default:
        console.log(color.red(`unknown command: ${cmdlineArgs.command || ""}`))
        return 1
    }
  } catch (err) {
    if (configuration && configuration.sourceDir) {
      process.chdir(configuration.sourceDir)
    }
    throw err
  }
}

export type { ActionArgs } from "./actions/types/action-args"
export type { Configuration } from "./configuration/types/configuration"
export { AstNode } from "./parsers/standard-AST/ast-node"
export { AstNodeList } from "./parsers/standard-AST/ast-node-list"
export { actionName } from "./actions/helpers/action-name"
