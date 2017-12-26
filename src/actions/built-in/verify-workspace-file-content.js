// @flow

const {bold, cyan, red} = require('chalk')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')
const {capitalize, filter} = require('prelude-ls')

module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}, done: DoneFunction) {
  const filePath = args.searcher.nodeContent({ types: ['strongtext', 'emphasizedtext']}, ({nodes, content}) => {
    if (nodes.length === 0) return 'no file path found'
    if (nodes.length > 1) return "multiple file paths found: #{nodes |> map (.content) |> map ((a) -> cyan a) |> (.join ' and ')}"
    if (content.length === 0) return 'no path given for file to verify'
  })

  const expectedContent = args.searcher.nodeContent({types: ['fence', 'code']}, ({nodes}) => {
    if (nodes.length === 0) return 'no text given to compare file content against'
    if (nodes.length > 1) return 'found multiple content blocks for file to verify, please provide only one'
  })

  args.formatter.start(`verifying file ${cyan(filePath)}`)
  const fullPath = path.join(args.configuration.testDir, filePath)
  fs.readFile(fullPath, 'utf8', (err, actualContent) => {
    if (err && err.code === 'ENOENT') {
      args.formatter.error(`file ${red(filePath)} not found`)
      done(new Error('1'))
      return
    } else if (err) {
      done(err)
      return
    }
    jsdiffConsole(actualContent.trim(), expectedContent.trim(), (err) => {
      if (err) {
        args.formatter.error(`mismatching content in ${cyan(bold(filePath))}:\n${err.message}`)
        done(new Error('1'))
      } else {
        args.formatter.success()
        done()
      }
    })
  })
}
