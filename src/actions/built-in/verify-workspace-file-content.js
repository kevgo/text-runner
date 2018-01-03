// @flow

const {bold, cyan, red} = require('chalk')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  const filePath = args.searcher.tagContent(['strongtext', 'emphasizedtext'])
  const expectedContent = args.searcher.tagContent(['fence', 'code'])
  args.formatter.start(`verifying file ${cyan(filePath)}`)
  const fullPath = path.join(args.configuration.testDir, filePath)
  var actualContent
  try {
    actualContent = fs.readFileSync(fullPath, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      args.formatter.error(`file ${red(filePath)} not found`)
      throw new Error('1')
    } else {
      throw err
    }
  }
  try {
    jsdiffConsole(actualContent.trim(), expectedContent.trim())
    args.formatter.success()
  } catch (err) {
    args.formatter.error(`mismatching content in ${cyan(bold(filePath))}:\n${err.message}`)
    throw new Error('1')
  }
}
