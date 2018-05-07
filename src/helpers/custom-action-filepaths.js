// @flow

const glob = require('glob')
const path = require('path')

module.exports = function customActionFilePaths (): string[] {
  const pattern = path.join(
    process.cwd(),
    'text-run',
    `*.@(${this.javascriptExtensions().join('|')})`
  )
  return glob.sync(pattern)
}
