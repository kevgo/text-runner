const callArgs = require('../dist/helpers/call-args')
const fs = require('fs')
const ObservableProcess = require('observable-process')
const path = require('path')

module.exports = async function ({configuration, formatter, searcher}) {
  formatter.setTitle('verify the inline markdown works in TextRunner')
  const markdown = searcher.tagContent('fence')
  fs.writeFileSync(path.join(configuration.testDir, '1.md'), markdown.replace(/​/g, ''))

  // we need to configure the TextRunner instance called by our own Markdown to run its tests in its current directory,
  // because in README.md we call it to run Markdown that verifies Markdown we ran manually.
  // So TextRunner that verifies Markdown in README.md must run in the same directory as the other Markdown in README.md.
  fs.writeFileSync(path.join(configuration.testDir, 'text-run.yml'), "useTempDirectory: '.'")

  var textRunPath = path.join(__dirname, '..', 'bin', 'text-run')
  if (process.platform === 'win32') textRunPath += '.cmd'
  const processor = new ObservableProcess({commands: callArgs(textRunPath), cwd: configuration.testDir, stdout: {write: formatter.output}, stderr: {write: formatter.output}})
  await processor.waitForEnd()
  if (processor.exitCode !== 0) {
    formatter.error(`text-run exited with code ${processor.exitCode} when processing this markdown block`)
  }
}
