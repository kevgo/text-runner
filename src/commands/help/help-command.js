// @flow

const {bold, dim, red} = require('chalk')
// $FlowFixMe: flow doesn't like requiring such an untyped file
const version: number = require('../../../package.json').version

class HelpCommand implements Command {
  error: string

  constructor (value: {error: string}) {
    this.error = value.error
  }

  run (done: DoneFunction) {
    console.log(this._template(this.error))
    done()
  }

  _template (error: string) {
    if (this.error) error = `${red(bold('Error: ' + error))}`
    return `

${dim('TextRunner ' + version)}
${error}
USAGE: ${bold('text-run [<options>] <command>')}

COMMANDS:
  ${bold('run')} [<filename>]  tests the entire documentation, or only the given file
  ${bold('setup')}             creates an example configuration file
  ${bold('help')}              shows this help screen
  ${bold('version')}           shows the currently installed version of the tool

OPTIONS:
  ${bold('--fast')}            don't check external links
`
  }
}

module.exports = HelpCommand
