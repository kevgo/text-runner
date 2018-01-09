const callArgs = require('../dist/helpers/call-args')
const fs = require('fs')
const ObservableProcess = require('observable-process')
const path = require('path')
const debug = require('debug')('text-runner:run-markdown-in-text-run')

module.exports = async function ({configuration, formatter, searcher}) {
  formatter.setTitle('verify the inline markdown works in TextRunner')
  const markdown = searcher.tagContent('fence')
  const filename = path.join(configuration.testDir, '1.md')
  const filecontent = markdown.replace(/​/g, '')
  debug(`writing file '${filename}' with content:`)
  debug(filecontent)
  fs.writeFileSync(filename, filecontent)

  // we need to configure the TextRunner instance called by our own Markdown to run its tests in its current directory,
  // because in README.md we call it to run Markdown that verifies Markdown we ran manually.
  // So TextRunner that verifies Markdown in README.md must run in the same directory as the other Markdown in README.md.
  fs.writeFileSync(path.join(configuration.testDir, 'text-run.yml'), "useTempDirectory: '.'")

  var textRunPath = path.join(__dirname, '..', 'bin', 'text-run')
  if (process.platform === 'win32') textRunPath += '.cmd'
  const processor = new ObservableProcess({commands: callArgs(textRunPath), cwd: configuration.testDir, stdout: {write: formatter.output}, stderr: {write: formatter.output}})
  await processor.waitForEnd()
  debug(processor.fullOutput())
  if (processor.exitCode !== 0) {
    throw new Error(`text-run exited with code ${processor.exitCode} when processing this markdown block.\nOutput:\n${processor.fullOutput()}`)
  }
}
