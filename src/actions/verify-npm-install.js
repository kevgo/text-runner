// @flow

import type { ActionArgs } from '../runners/action-args.js'

const { cyan } = require('chalk')
const jsonfile = require('jsonfile')
const path = require('path')
const trimDollar = require('../helpers/trim-dollar')

module.exports = function (args: ActionArgs) {
  const installText = trimDollar(args.nodes.textInNodeOfType('fence', 'code'))
  const pkg = jsonfile.readFileSync(
    path.join(args.configuration.sourceDir, 'package.json')
  )
  args.formatter.name(`verify NPM installs ${cyan(pkg.name)}`)

  if (missesPackageName(installText, pkg.name)) {
    throw new Error(
      `could not find ${cyan(pkg.name)} in installation instructions`
    )
  }
}

function missesPackageName (installText: string, packageName: string): boolean {
  // Note: cannot use minimist here
  //       because it is too stupid to understand
  //       that NPM uses '-g' by itself, and not as a switch for the argument after it
  return (
    installText
      .split(' ')
      .map(word => word.trim())
      .filter(word => word === packageName).length === 0
  )
}
