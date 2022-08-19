import minimist from "minimist"
import * as path from "path"
import * as tr from "text-runner-core"

import * as commands from "./commands/index.js"
import * as config from "./configuration.js"

/**
 * Parses the command-line options received and returns them
 * structured as the command to run and options.
 */
export function parse(argv: string[]): {
  cmdLineConfig: config.Data
  commandName: string
  debugSubcommand?: tr.commands.DebugSubcommand
} {
  // remove optional node parameter
  if (
    path.basename(argv[0] || "") === "node" ||
    path.win32.basename(argv[0] || "") === "node.exe" ||
    argv[0].includes("node_modules/ts-node")
  ) {
    argv.splice(0, 1)
  }

  // remove text-run parameter
  const unixBasename = path.basename(argv[0] || "")
  const winBasename = path.win32.basename(argv[0] || "")
  if (unixBasename === "text-run" || winBasename === "text-run.cmd" || winBasename === "text-run.mjs") {
    argv.splice(0, 1)
  }
  // remove optional CLI parameter
  if (unixBasename === "index.js" || winBasename === "index.js") {
    argv.splice(0, 1)
  }

  // parse argv into the result
  const cliArgs = minimist(argv, { boolean: true })
  let commandName = cliArgs._[0]
  const cmdLineConfig = new config.Data({
    configFileName: cliArgs.config,
    emptyWorkspace: cliArgs["empty-workspace"],
    exclude: cliArgs.exclude,
    files: cliArgs._[1], // after the command can be a filename, as in "text-run debug foo.md"
    formatterName: cliArgs.format,
    online: cliArgs.online,
    workspace: cliArgs.workspace,
    scaffoldLanguage: parseScaffoldSwitches(cliArgs),
  })
  if (cliArgs["system-tmp"] != null) {
    cmdLineConfig.systemTmp = parseSystemTmp(cliArgs["system-tmp"])
  }
  if (cliArgs["show-skipped"] != null) {
    cmdLineConfig.showSkipped = parseSystemTmp(cliArgs["show-skipped"])
  }

  // handle special case where text-run is called without a command, as in "text-run foo.md"
  if (!commands.names().includes(commandName)) {
    cmdLineConfig.files = commandName
    commandName = "run"
  }

  let debugSubcommand: tr.commands.DebugSubcommand | undefined
  if (commandName === "debug") {
    debugSubcommand = parseDebugSubcommand(cliArgs)
  }
  return { commandName, cmdLineConfig, debugSubcommand }
}

function parseDebugSubcommand(cliArgs: minimist.ParsedArgs): tr.commands.DebugSubcommand {
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
    throw new tr.UserError(
      "Missing or invalid debug subcommand",
      `Valid debug subcommands are: ${tr.commands.DebugSubCommandValues.join(", ")}.
Please provide the debug subcommands as switches, e.g. "text-run debug --ast README.md"`
    )
  }
}

function parseScaffoldSwitches(cliArgs: minimist.ParsedArgs): commands.ScaffoldLanguage {
  if (cliArgs.ts) {
    return "ts"
  } else {
    return "js"
  }
}

function parseSystemTmp(value: any): boolean | undefined {
  switch (value) {
    case true:
      return true
    case false:
      return false
    default:
      throw new tr.UserError(
        `unknown value for "system-tmp" setting: ${value}`,
        'Set the "system-tmp" setting to "true" to have Text-Runner put the test workspace into the global system temp folder and "false" to put it into the current folder.'
      )
  }
}
