// @flow

import type { ActionArgs } from '../src/commands/run/5-execute/action-args.js'

const callArgs = require('../src/helpers/call-args')
const ObservableProcess = require('observable-process')
const path = require('path')

module.exports = async function (args: ActionArgs) {
  args.formatter.setTitle('running the created Markdown file in TextRunner')

  var textRunPath = path.join(__dirname, '..', 'bin', 'text-run')
  if (process.platform === 'win32') textRunPath += '.cmd'
  const processor = new ObservableProcess({
    commands: callArgs(textRunPath),
    cwd: args.configuration.testDir,
    stdout: { write: args.formatter.output },
    stderr: { write: args.formatter.output }
  })
  await processor.waitForEnd()
  if (processor.exitCode !== 0) {
    args.formatter.error(
      `text-run exited with code ${
        processor.exitCode
      } when processing the created Markdown file`
    )
  }
}
