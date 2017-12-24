// @flow

const {bold, cyan} = require('chalk')
const path = require('path')
const debug = require('debug')('textrun:actions:cd')

// Changes the current working directory to the one given in the hyperlink or code block
module.exports = function (value: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  value.formatter.start('changing the current working directory')
  const directory = value.searcher.nodeContent({types: ['link_open', 'code']}, (v: {nodes: AstNodeList, content: string}): ?string => {
    if (v.nodes.length === 0) return 'no link found'
    if (v.nodes.length > 1) return 'too many links found'
    if (v.content.trim().length === 0) return 'empty link found'
    return null
  })

  value.formatter.refine(`changing into the ${bold(cyan(directory))} directory`)
  value.formatter.output(`cd ${directory}`)
  try {
    const fullPath = path.join(value.configuration.testDir, directory)
    debug(fullPath)
    process.chdir(fullPath)
    value.formatter.success()
  } catch (e) {
    debug(e)
    if (e.code === 'ENOENT') {
      value.formatter.error(`directory ${directory} not found`)
    } else {
      value.formatter.error(e.message)
    }
    throw e
  }
}
