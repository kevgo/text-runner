import minimist from "minimist"
import * as path from "path"
import * as textRunner from "text-runner-engine"

import * as commands from "./commands/index.js"
import * as config from "./configuration.js"

/**
 * Parses the command-line options received and returns them
 * structured as the command to run and options.
 */
export function parse(argv: string[]): {
  cmdLineConfig: config.Data
  commandName: string
  debugSubcommand?: textRunner.commands.DebugSubcommand
} {
  // remove optional node parameter
  if (
    path.basename(argv[0] || "") === "node"
    || path.win32.basename(argv[0] || "") === "node.exe"
    || argv[0]?.includes("node_modules/tsx")
    || argv[0]?.includes("node_modules\\tsx")
    || argv[0]?.startsWith("/usr/bin/node")
  ) {
    argv.splice(0, 1)
  }
  if (argv[0]?.endsWith("text-runner")) {
    argv.splice(0, 1)
  }

  // remove text-runner parameter
  const unixBasename = path.basename(argv[0] || "")
  const winBasename = path.win32.basename(argv[0] || "")
  if (unixBasename === "text-runner" || winBasename === "text-runner.cmd" || winBasename === "text-runner.mjs") {
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
    files: cliArgs._[1], // after the command can be a filename, as in "text-runner debug foo.md"
    format: cliArgs.format,
    online: cliArgs.online,
    scaffoldLanguage: parseScaffoldSwitches(cliArgs),
    workspace: cliArgs.workspace
  })
  if (cliArgs["system-tmp"] != null) {
    cmdLineConfig.systemTmp = parseSystemTmp(cliArgs["system-tmp"])
  }
  if (cliArgs["show-skipped"] != null) {
    cmdLineConfig.showSkipped = parseSystemTmp(cliArgs["show-skipped"])
  }

  // handle special case where text-runner is called without a command, as in "text-runner foo.md"
  if (!commands.names().includes(commandName)) {
    cmdLineConfig.files = commandName
    commandName = "run"
  }

  let debugSubcommand: textRunner.commands.DebugSubcommand | undefined
  if (commandName === "debug") {
    debugSubcommand = parseDebugSubcommand(cliArgs)
  }
  return { cmdLineConfig, commandName, debugSubcommand }
}

function parseDebugSubcommand(cliArgs: minimist.ParsedArgs): textRunner.commands.DebugSubcommand {
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
    throw new textRunner.UserError(
      "Missing or invalid debug subcommand",
      `Valid debug subcommands are: ${textRunner.commands.DebugSubCommandValues.join(", ")}.
Please provide the debug subcommands as switches, e.g. "text-runner debug --ast README.md"`
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
    case false:
      return false
    case true:
      return true
    default:
      throw new textRunner.UserError(
        `unknown value for "system-tmp" setting: ${value}`,
        'Set the "system-tmp" setting to "true" to have Text-Runner put the test workspace into the global system temp folder and "false" to put it into the current folder.'
      )
  }
}
