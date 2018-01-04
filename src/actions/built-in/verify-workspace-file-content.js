// @flow

const {bold, cyan, red} = require('chalk')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function (activity: Activity) {
  const filePath = activity.searcher.nodeContent({ types: ['strongtext', 'emphasizedtext'] }, ({nodes, content}) => {
    if (nodes.length === 0) return 'no file path found'
    if (nodes.length > 1) return "multiple file paths found: #{nodes |> map (.content) |> map ((a) -> cyan a) |> (.join ' and ')}"
    if (content.length === 0) return 'no path given for file to verify'
  })

  const expectedContent = activity.searcher.nodeContent({types: ['fence', 'code']}, ({nodes}) => {
    if (nodes.length === 0) return 'no text given to compare file content against'
    if (nodes.length > 1) return 'found multiple content blocks for file to verify, please provide only one'
  })

  activity.formatter.action(`verifying file ${cyan(filePath)}`)
  const fullPath = path.join(activity.configuration.testDir, filePath)
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
