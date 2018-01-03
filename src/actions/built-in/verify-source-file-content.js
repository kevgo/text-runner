// @flow

const {bold, cyan} = require('chalk')
const eol = require('eol')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  const fileName = args.searcher.tagContent('strongtext')
  var baseDir = args.searcher.tagContent('link_open')
  baseDir = baseDir || '.'

  const expectedContent = args.searcher.tagContent('fence')

  args.formatter.start(`verifying document content matches source code file ${cyan(fileName)}`)
  const filePath = path.join(__dirname, '..', '..', '..', baseDir, fileName)
  var actualContent
  try {
    actualContent = fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      args.formatter.error(`file ${cyan(filePath)} not found`)
      throw new Error('1')
    } else {
      throw err
    }
  }
  try {
    jsdiffConsole(eol.lf(actualContent.trim()), eol.lf(expectedContent.trim()))
  } catch (err) {
    console.log(err)
    args.formatter.error(`mismatching content in ${cyan(bold(filePath))}:\n${err.message}`)
    throw new Error('1')
  }

  args.formatter.success()
}
