// @flow

const glob = require('glob')
const javascriptExtensions = require('./javascript-extensions.js')
const path = require('path')

module.exports = function customActionFilePaths (): string[] {
  const pattern = path.join(
    process.cwd(),
    'text-run',
    `*.@(${javascriptExtensions().join('|')})`
  )
  return glob.sync(pattern)
}
