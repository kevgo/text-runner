// @flow

const {bold, cyan} = require('chalk')
const path = require('path')
const debug = require('debug')('textrun:actions:cd')

// Changes the current working directory to the one given in the hyperlink or code block
module.exports = function (params: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  params.formatter.start('changing the current working directory')
  const directory = params.searcher.nodeContent({types: ['link_open', 'code']}, (v: {nodes: AstNodeList, content: string}): ?string => {
    if (v.nodes.length === 0) return 'no link found'
    if (v.nodes.length > 1) return 'too many links found'
    if (v.content.trim().length === 0) return 'empty link found'
    return null
  })

  params.formatter.refine(`changing into the ${bold(cyan(directory))} directory`)
  params.formatter.output(`cd ${directory}`)
  const fullPath = path.join(params.configuration.testDir, directory)
  debug(`changing into directory '${fullPath}`)
  try {
    process.chdir(fullPath)
  } catch (e) {
    if (e.code === 'ENOENT') throw new Error(`directory ${directory} not found`)
    throw e
  }
}
