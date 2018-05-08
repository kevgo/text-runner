// @flow

import type { ActionArgs } from '../commands/run/5-execute/action-args.js'

const { bold, cyan } = require('chalk')
const eol = require('eol')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function (args: ActionArgs) {
  const fileName = args.nodes.textInNode('strongtext')
  var relativeBaseDir = '.'
  if (args.nodes.hasNode('link')) {
    relativeBaseDir = args.nodes.textInNode('link_open')
  }
  const expectedContent = args.nodes.textInNode('fence')
  args.formatter.setTitle(
    `verifying document content matches source code file ${cyan(fileName)}`
  )
  const filePath = path.join(path.dirname(args.file), relativeBaseDir, fileName)
  var actualContent
  try {
    actualContent = fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`file ${cyan(filePath)} not found`)
    } else {
      throw err
    }
  }
  try {
    jsdiffConsole(eol.lf(actualContent.trim()), eol.lf(expectedContent.trim()))
  } catch (err) {
    throw new Error(
      `mismatching content in ${cyan(bold(filePath))}:\n${err.message}`
    )
  }
}
