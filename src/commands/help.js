// @flow

const { bold, dim, red } = require('chalk')
// $FlowFixMe: flow doesn't like requiring such an untyped file
const version: number = require('../../package.json').version

module.exports = async function helpCommand (error: ?string) {
  console.log(template(error))
}

function template (error: ?string) {
  if (error) error = `${red(bold('Error: ' + error))}`
  return `
${dim('TextRunner ' + version)}
${error || ''}
USAGE: ${bold('text-run [<options>] <command>')}

COMMANDS
  ${bold(
    'run'
  )} [<filename>]  tests the entire documentation, or only the given file/folder
  ${bold('add')} <filename>    scaffolds a new block type handler
  ${bold('setup')}             creates an example configuration file
  ${bold('version')}           shows the currently installed version
  ${bold('help')}              shows this help screen

OPTIONS
  ${bold('--config')}          provide a custom configuration filename
  ${bold('--offline')}         don't check external links
`
}
