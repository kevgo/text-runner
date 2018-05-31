// @flow

import type { ActionArgs } from '../runners/action-args.js'

const { cyan, red } = require('chalk')
const path = require('path')
const trimDollar = require('../helpers/trim-dollar')

module.exports = function (args: ActionArgs) {
  args.formatter.name('NPM module exports the command')
  const commandName = trimDollar(
    args.nodes.textInNodeOfType('fence', 'code').trim()
  )
  const pkg = require(path.join(args.configuration.sourceDir, 'package.json'))
  args.formatter.name(`NPM module exports the ${cyan(commandName)} command`)

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
  return Object.keys(exportedCommands).includes(commandName)
}
