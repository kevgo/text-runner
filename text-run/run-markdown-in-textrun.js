
// $FlowFixMe
const callArgs = require('../dist/helpers/call-args')
const fs = require('fs')
const ObservableProcess = require('observable-process')
const path = require('path')

module.exports = function ({configuration, formatter, searcher}, done) {
  formatter.start('verify that markdown works in text-run')

  const markdown = searcher.nodeContent({type: 'fence'}, ({content, nodes}) => {
    if (nodes.length > 1) return 'Found #{nodes.length} fenced code blocks. Only one is allowed.'
    if (nodes.length === 0) return 'You must provide the Markdown to run via text-run as a fenced code block. No such fenced block found.'
    if (!content) return 'A fenced code block containing the Markdown to run was found, but it is empty, so I cannot run anything here.'
  })

  fs.writeFileSync(path.join(configuration.testDir, '1.md'), markdown.replace(/​/g, ''))

  // we need to configure the TextRunner instance called by our own Markdown to run its tests in its current directory,
  // because in README.md we call it to run Markdown that verifies Markdown we ran manually.
  // So TextRunner that verifies Markdown in README.md must run in the same directory as the other Markdown in README.md.
  fs.writeFileSync(path.join(configuration.testDir, 'text-run.yml'), "useTempDirectory: '.'")

  var textRunPath = path.join(__dirname, '..', 'bin', 'text-run')
  if (process.platform === 'win32') textRunPath += '.cmd'
  const processor = new ObservableProcess(callArgs(textRunPath), {cwd: configuration.testDir, stdout: {write: formatter.output}, stderr: {write: formatter.output}})
  processor.on('ended', (exitCode) => {
    if (exitCode === 0) {
      formatter.success()
    } else {
      formatter.error(`text-run exited with code ${exitCode} when processing this markdown block`)
    }
    done(exitCode)
  })
}
