// @flow

import type { ActionArgs } from '../commands/run/5-execute/action-args.js'

const { cyan, red } = require('chalk')
const path = require('path')
const trimDollar = require('../helpers/trim-dollar')

module.exports = function (args: ActionArgs) {
  args.formatter.setTitle('NPM module exports the command')
  const commandName = trimDollar(args.nodes.textInNodeOfType('fence', 'code'))
  const pkg = require(path.join(process.cwd(), 'package.json'))
  args.formatter.setTitle(`NPM module exports the ${cyan(commandName)} command`)

  if (!hasCommandName(commandName, pkg.bin)) {
    throw new Error(
      `${cyan('package.json')} does not export a ${red(commandName)} command`
    )
  }
}

function hasCommandName (
  commandName: string,
  exportedCommands: { [string]: string }
): boolean {
  return Object.keys(exportedCommands).some(command => command === commandName)
}
