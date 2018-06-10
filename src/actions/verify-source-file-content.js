// @flow

import type { ActionArgs } from '../runners/action-args.js'

const { bold, cyan } = require('chalk')
const eol = require('eol')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function (args: ActionArgs) {
  const fileName = args.nodes.textInNodeOfType('strong_open')
  var relativeBaseDir = '.'
  if (args.nodes.hasNodeOfType('link_open')) {
    const linkNode = args.nodes.getNodeOfTypes('link_open')
    relativeBaseDir = linkNode.attributes.href
  }
  const expectedContent = args.nodes.textInNodeOfType('fence')
  args.formatter.name(
    `verifying document content matches source code file ${cyan(fileName)}`
  )
  const filePath = path.join(
    args.configuration.sourceDir,
    path.dirname(args.file),
    relativeBaseDir,
    fileName
  )
  args.formatter.log(`ls ${filePath}`)
  var actualContent
  try {
    actualContent = fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`file ${cyan(fileName)} not found`)
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
