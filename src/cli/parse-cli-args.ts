import minimist from 'minimist'
import path from 'path'
import { availableCommands } from '../commands/available-commands'
import { CliArgTypes } from './cli-arg-types'

/**
 * Parses the command-line options received
 * and returns them structured as the command to run and options.
 *
 * @param argv the command-line options received by the process
 */
export function parseCliArgs(argv: string[]): CliArgTypes {
  // remove optional unix node call
  if (path.basename(argv[0] || '') === 'node') {
    argv.splice(0, 1)
  }

  // remove optional windows node call
  if (path.win32.basename(argv[0] || '') === 'node.exe') {
    argv.splice(0, 1)
  }

  // remove optional linux text-run call
  if (path.basename(argv[0] || '') === 'text-run') {
    argv.splice(0, 1)
  }

  // remove optional Windows CLI call
  if (argv[0] && argv[0].endsWith('dist\\cli\\cli.js')) {
    argv.splice(0, 1)
  }

  // parse argv
  const cliArgs = minimist(argv, { boolean: 'offline' })
  const result: CliArgTypes = {
    command: cliArgs._[0],
    config: cliArgs.config,
    exclude: cliArgs.exclude,
    files: cliArgs._[1],
    format: cliArgs.format,
    offline: cliArgs.offline
  }

  // if text-run is called without command, execute the "run" command
  if (!availableCommands().includes(cliArgs._[0])) {
    result.command = 'run'
    result.files = cliArgs._[0]
  }

  return result
}
