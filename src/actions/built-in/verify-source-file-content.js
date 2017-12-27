// @flow

const {bold, cyan} = require('chalk')
const eol = require('eol')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  const fileName = args.searcher.nodeContent({type: 'strongtext'}, ({nodes, content}) => {
    if (nodes.length === 0) return 'no file path found'
    if (nodes.length > 1) return "multiple file paths found: #{nodes |> map (.content) |> map ((a) -> cyan a) |> (.join ' and ')}"
    if (content.length === 0) return 'no path given for file to verify'
  })

  var baseDir = args.searcher.nodeContent({ type: 'link_open'}, ({nodes, content}) => {
    if (nodes.length > 1) return 'too many links found'
    if (content.trim().length === 0) return 'empty link found'
  })
  baseDir = baseDir || '.'

  const expectedContent = args.searcher.nodeContent({type: 'fence'}, ({nodes}) => {
    if (nodes.length === 0) return 'no text given to compare file content against'
    if (nodes.length > 1) return 'found multiple content blocks for file to verify, please provide only one'
  })

  args.formatter.start(`verifying document content matches source code file ${cyan(fileName)}`)
  const filePath = path.join(__dirname, '..', '..', '..', baseDir, fileName)
  var actualContent
  try {
    actualContent = fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      args.formatter.error(`file ${cyan(filePath)} not found`)
      throw new Error('1')
    } else {
      throw err
    }
  }
  try {
    jsdiffConsole(eol.lf(actualContent.trim()), eol.lf(expectedContent.trim()))
  } catch (err) {
    console.log(err)
    args.formatter.error(`mismatching content in ${cyan(bold(filePath))}:\n${err.message}`)
    throw new Error('1')
  }

  args.formatter.success()
}
