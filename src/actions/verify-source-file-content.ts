import { ActionArgs } from '../runners/action-args'

import chalk from 'chalk'
import eol from 'eol'
import fs from 'fs'
import jsdiffConsole from 'jsdiff-console'
import path from 'path'

export default function(args: ActionArgs) {
  const fileName = args.nodes.textInNodeOfType('strong_open')
  let relativeBaseDir = '.'
  if (args.nodes.hasNodeOfType('link_open')) {
    const linkNode = args.nodes.getNodeOfTypes('link_open')
    relativeBaseDir = linkNode.attributes.href
  }
  const expectedContent = args.nodes.textInNodeOfType('fence')
  args.formatter.name(
    `verifying document content matches source code file ${chalk.cyan(
      fileName
    )}`
  )
  const filePath = path.join(
    args.configuration.sourceDir,
    path.dirname(args.file),
    relativeBaseDir,
    fileName
  )
  args.formatter.log(`ls ${filePath}`)
  let actualContent
  try {
    actualContent = fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`file ${chalk.cyan(fileName)} not found`)
    } else {
      throw err
    }
  }
  try {
    jsdiffConsole(eol.lf(actualContent.trim()), eol.lf(expectedContent.trim()))
  } catch (err) {
    throw new Error(
      `mismatching content in ${chalk.cyan(chalk.bold(filePath))}:\n${
        err.message
      }`
    )
  }
}
