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
export function parseCmdlineArgs(argv: string[]): UserProvidedConfiguration {
  // remove optional unix node call
  if (path.basename(argv[0] || "") === "node") {
    argv.splice(0, 1)
  }

  // remove optional windows node call
  if (path.win32.basename(argv[0] || "") === "node.exe") {
    argv.splice(0, 1)
  }

  // remove optional linux text-run call
  if (path.basename(argv[0] || "") === "text-run") {
    argv.splice(0, 1)
  }

  // remove optional Windows CLI call
  if (argv[0] && argv[0].endsWith("dist\\cli.js")) {
    argv.splice(0, 1)
  }

  // remove optional debug arguments
  if (argv[0] && argv[0].endsWith("dist/cli.js")) {
    argv.splice(0, 1)
  }

  // parse argv into the result
  const cliArgs = minimist(argv, { boolean: ["offline", "keep-workspace"] })
  const result: UserProvidedConfiguration = {
    command: cliArgs._[0], // the first argument is the command to run, as in "text-run debug"
    configFileName: cliArgs.config,
    exclude: cliArgs.exclude,
    fileGlob: cliArgs._[1], // after the command can be a filename, as in "text-run debug foo.md"
    formatterName: cliArgs.format,
    keepWorkspace: cliArgs["keep-workspace"],
    offline: cliArgs.offline,
    workspace: cliArgs.workspace,
  }

  // handle special case where text-run is called without a command, as in "text-run foo.md"
  if (!availableCommands().includes(cliArgs._[0])) {
    result.command = "run"
    result.fileGlob = cliArgs._[0]
  }

  return result
}
