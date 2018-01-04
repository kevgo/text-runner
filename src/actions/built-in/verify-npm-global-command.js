// @flow

const {cyan, red} = require('chalk')
const path = require('path')
const trimDollar = require('../../helpers/trim-dollar')

module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  args.formatter.action('NPM module exports the command')

  const commandName = trimDollar(args.searcher.nodeContent({types: ['fence', 'code']}, ({nodes}) => {
    if (nodes.length === 0) return 'missing code block'
    if (nodes.length > 1) return 'found multiple code blocks'
  })).trim()

  const pkg = require(path.join(process.cwd(), 'package.json'))
  args.formatter.action(`NPM module exports the ${cyan(commandName)} command`)

  if (!hasCommandName(commandName, pkg.bin)) {
    throw new Error(`${cyan('package.json')} does not export a ${red(commandName)} command`)
  }
}

function hasCommandName (commandName: string, exportedCommands: { [string]: string}): boolean {
  return Object.keys(exportedCommands)
               .some((command) => command === commandName)
}
