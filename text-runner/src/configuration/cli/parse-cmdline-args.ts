import * as minimist from "minimist"
import * as path from "path"
import { availableCommands } from "../../commands/available-commands"
import { UserProvidedConfiguration } from "../types/user-provided-configuration"

/**
 * Parses the command-line options received
 * and returns them structured as the command to run and options.
 *
 * @param argv the command-line options received by the process
 */
export function parseCmdlineArgs(argv: string[]): { command: string; config: UserProvidedConfiguration } {
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
  const cliArgs = minimist(argv, { boolean: ["online", "activities", "ast", "images", "links", "link-targets"] })
  let command = cliArgs._[0]
  const config: UserProvidedConfiguration = {
    configFileName: cliArgs.config,
    exclude: cliArgs.exclude,
    files: cliArgs._[1], // after the command can be a filename, as in "text-run debug foo.md"
    formatterName: cliArgs.format,
    online: cliArgs.online,
    workspace: cliArgs.workspace,
    debugSwitches: {
      activities: cliArgs.activities,
      ast: cliArgs.ast,
      images: cliArgs.images,
      links: cliArgs.links,
      linkTargets: cliArgs["link-targets"],
    },
  }

  // handle special case where text-run is called without a command, as in "text-run foo.md"
  if (!availableCommands().includes(command)) {
    config.files = command
    command = "run"
  }

  return { command, config }
}
