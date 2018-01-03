// @flow

const {cyan, green} = require('chalk')
const jsonfile = require('jsonfile')
const path = require('path')
const trimDollar = require('../../helpers/trim-dollar')

module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  args.formatter.start('verifying NPM installation instructions')
  const installText = trimDollar(args.searcher.tagContent(['fence', 'code']))
  const pkg = jsonfile.readFileSync(path.join(process.cwd(), 'package.json'))
  args.formatter.start(`verifying NPM installs ${cyan(pkg.name)}`)

  if (missesPackageName(installText, pkg.name)) {
    args.formatter.error(`could not find ${cyan(pkg.name)} in installation instructions`)
    throw new Error('1')
  }
  args.formatter.success(`installs ${green(pkg.name)}`)
}

function missesPackageName (installText: string, packageName: string): boolean {
  // Note: cannot use minimist here
  //       because it is too stupid to understand
  //       that NPM uses '-g' by itself, and not as a switch for the argument after it
  return installText.split(' ')
                    .map((word) => word.trim())
                    .filter((word) => word === packageName)
                    .length === 0
}
