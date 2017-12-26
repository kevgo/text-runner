const callArgs = require('../dist/helpers/call-args')
const ObservableProcess = require('observable-process')
const fs = require('fs')
const path = require('path')

module.exports = function ({configuration, formatter, searcher}, done) {
  formatter.start('running the created Markdown file')

  textRunPath = path.join(__dirname, '..', 'bin', 'text-run')
  if (process.platform === 'win32') textRunPath += '.cmd'
  const processor = new ObservableProcess(callArgs(textRunPath), {cwd: configuration.testDir, stdout: {write: formatter.output}, stderr: {write: formatter.output}})
  processor.on('ended', (exitCode) => {
    if (exitCode === 0) {
      formatter.success()
    } else {
      formatter.error(`text-run exited with code ${exitCode} when processing the created Markdown file`)
    }
    done(exitCode)
  })
}
