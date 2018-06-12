// @flow

import type { ActionArgs } from '../src/runners/action-args.js'

/* eslint no-irregular-whitespace: 0 */

const callArgs = require('../src/helpers/call-args')
const fs = require('fs')
const ObservableProcess = require('observable-process')
const path = require('path')
const debug = require('debug')('text-runner:run-markdown-in-text-run')

module.exports = async function (args: ActionArgs) {
  args.formatter.name('verify the inline markdown works in TextRunner')
  const markdown = args.nodes.textInNodeOfType('fence')
  const filename = path.join(args.configuration.workspace, '1.md')
  const filecontent = markdown.replace(/​/g, '')
  debug(`writing file '${filename}' with content:`)
  debug(filecontent)
  fs.writeFileSync(filename, filecontent)

  var textRunPath = path.join(__dirname, '..', 'bin', 'text-run')
  if (process.platform === 'win32') textRunPath += '.cmd'
  const trArgs = callArgs(textRunPath)
  trArgs[trArgs.length - 1] += ` --keep-tmp --workspace ${
    args.configuration.workspace
  }`
  const processor = new ObservableProcess({
    commands: trArgs,
    cwd: args.configuration.workspace,
    stdout: args.formatter.stdout,
    stderr: args.formatter.stderr
  })
  await processor.waitForEnd()
  debug(processor.fullOutput())
  if (processor.exitCode !== 0) {
    throw new Error(
      `text-run exited with code ${
        processor.exitCode
      } when processing this markdown block.`
    )
  }
}
