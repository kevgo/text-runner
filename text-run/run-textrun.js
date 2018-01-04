const callArgs = require('../dist/helpers/call-args')
const ObservableProcess = require('observable-process')
const path = require('path')

module.exports = async function ({configuration, formatter, searcher}) {
  formatter.action('running the created Markdown file')

  var textRunPath = path.join(__dirname, '..', 'bin', 'text-run')
  if (process.platform === 'win32') textRunPath += '.cmd'
  const processor = new ObservableProcess({command: callArgs(textRunPath), cwd: configuration.testDir, stdout: {write: formatter.output}, stderr: {write: formatter.output}})
  await processor.waitForEnd()
  if (processor.exitCode === 0) {
    formatter.success()
  } else {
    formatter.error(`text-run exited with code ${processor.exitCode} when processing the created Markdown file`)
  }
}
