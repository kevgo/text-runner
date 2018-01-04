// @flow

const {cyan} = require('chalk')
const jsonfile = require('jsonfile')
const path = require('path')
const trimDollar = require('../../helpers/trim-dollar')

module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  args.formatter.action('verifying NPM installation instructions')

  const installText = trimDollar(args.searcher.nodeContent({types: ['fence', 'code']}, ({nodes}) => {
    if (nodes.length === 0) return 'missing code block'
    if (nodes.length > 1) return 'found multiple code blocks'
  }))

  const pkg = jsonfile.readFileSync(path.join(process.cwd(), 'package.json'))
  args.formatter.action(`verify NPM installs ${cyan(pkg.name)}`)

  if (missesPackageName(installText, pkg.name)) {
    throw new Error(`could not find ${cyan(pkg.name)} in installation instructions`)
  }
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
