// @flow

import type { ActionArgs } from '../runners/action-args.js'

const { bold, cyan, red } = require('chalk')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function (args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType('strong', 'em')
  const expectedContent = args.nodes.textInNodeOfType('fence', 'code')
  args.formatter.name(`verifying file ${cyan(filePath)}`)
  const fullPath = path.join(process.cwd(), filePath)
  args.formatter.log(`verify file ${fullPath}`)
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
    throw new Error(
      `mismatching content in ${cyan(bold(filePath))}:\n${err.message}`
    )
  }
}
