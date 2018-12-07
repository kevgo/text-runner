import chalk from 'chalk'

export default (async function helpCommand(error?: string) {
  console.log(template(error))
})

function template(error: string | undefined) {
  if (error) {
    error = `${chalk.red(chalk.bold('Error: ' + error))}`
  }
  const { version } = require('../../package.json')

  return `
${chalk.dim('TextRunner ' + version)}
${error || ''}
USAGE: ${chalk.bold('text-run [<options>] <command>')}

COMMANDS
  ${chalk.bold(
    'run'
  )} [<filename>]      runs all tests on the given file/folder or entire documentation
  ${chalk.bold(
    'dynamic'
  )} [<filename>]  runs only the programmatic tests, skips checking links
  ${chalk.bold(
    'static'
  )} [<filename>]   checks only the links, skips programmatic tests

  ${chalk.bold('setup')}                 creates an example configuration file
  ${chalk.bold('add')} <filename>        scaffolds a new block type handler

  ${chalk.bold('help')}                  shows this help screen
  ${chalk.bold('version')}               shows the currently installed version
  ${chalk.bold('debug')}                 shows debug data

OPTIONS
  ${chalk.bold('--config')}              provide a custom configuration filename
  ${chalk.bold('--offline')}             don't check external links
`
}
