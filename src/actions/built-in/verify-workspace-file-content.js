// @flow

const {bold, cyan, red} = require('chalk')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  const filePath = args.searcher.tagContent(['strongtext', 'emphasizedtext'])
  const expectedContent = args.searcher.tagContent(['fence', 'code'])
  args.formatter.action(`verifying file ${cyan(filePath)}`)
  const fullPath = path.join(args.configuration.testDir, filePath)
  var actualContent
  try {
    actualContent = fs.readFileSync(fullPath, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`file ${red(filePath)} not found`)
    } else {
      throw err
    }
  }
  try {
    jsdiffConsole(actualContent.trim(), expectedContent.trim())
  } catch (err) {
    throw new Error(`mismatching content in ${cyan(bold(filePath))}:\n${err.message}`)
  }
}
