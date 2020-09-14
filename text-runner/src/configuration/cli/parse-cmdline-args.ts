import * as minimist from "minimist"
import * as path from "path"
import { availableCommands } from "../../commands/available-commands"
import { UserProvidedConfiguration } from "../user-provided-configuration"
import { DebugSubcommand } from "../../commands/debug"
import { ScaffoldLanguage } from "../../commands/scaffold"
import { UserError } from "../../errors/user-error"

/**
 * Parses the command-line options received
 * and returns them structured as the command to run and options.
 *
 * @param argv the command-line options received by the process
 */
export function parseCmdlineArgs(
  argv: string[]
): { commandName: string; cmdLineConfig: UserProvidedConfiguration; debugSubcommand?: DebugSubcommand } {
  // remove optional node parameter
  if (path.basename(argv[0] || "") === "node" || path.win32.basename(argv[0] || "") === "node.exe") {
    argv.splice(0, 1)
  }

  // remove text-run parameter
  const unixBasename = path.basename(argv[0] || "")
  const winBasename = path.win32.basename(argv[0] || "")
  if (unixBasename === "text-run" || winBasename === "text-run.cmd") {
    argv.splice(0, 1)
  }
  // remove optional CLI parameter
  if (unixBasename === "cli.js" || winBasename === "cli.js") {
    argv.splice(0, 1)
  }

  // parse argv into the result
  const cliArgs = minimist(argv, { boolean: true })
  let command = cliArgs._[0]
  const config: UserProvidedConfiguration = {
    configFileName: cliArgs.config,
    exclude: cliArgs.exclude,
    files: cliArgs._[1], // after the command can be a filename, as in "text-run debug foo.md"
    formatterName: cliArgs.format,
    online: cliArgs.online,
    workspace: cliArgs.workspace,
    scaffoldLanguage: parseScaffoldSwitches(cliArgs),
  }
  if (cliArgs["system-tmp"] != null) {
    config.useSystemTempDirectory = parseSystemTmp(cliArgs["system-tmp"])
  }

  // handle special case where text-run is called without a command, as in "text-run foo.md"
  if (!availableCommands().includes(command)) {
    config.files = command
    command = "run"
  }

  let debugSubcommand: DebugSubcommand | undefined
  if (command === "debug") {
    debugSubcommand = parseDebugSubcommand(cliArgs)
  }
  return { commandName: command, cmdLineConfig: config, debugSubcommand }
}

function parseSystemTmp(value: any): boolean | undefined {
  switch (value) {
    case true:
      return true
    case false:
      return false
    default:
      throw new UserError(`unknown value for "system-tmp" setting: ${value}`)
  }
}

function parseDebugSubcommand(cliArgs: minimist.ParsedArgs): DebugSubcommand {
  if (cliArgs.activities) {
    return "activities"
  } else if (cliArgs.ast) {
    return "ast"
  } else if (cliArgs.images) {
    return "images"
  } else if (cliArgs.links) {
    return "links"
  } else if (cliArgs["link-targets"]) {
    return "linkTargets"
  } else {
    throw new UserError("Missing debug subcommand")
  }
}

function parseScaffoldSwitches(cliArgs: minimist.ParsedArgs): ScaffoldLanguage {
  if (cliArgs.ts) {
    return "ts"
  } else {
    return "js"
  }
}
