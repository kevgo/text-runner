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
  try {
    const fullPath = path.join(params.configuration.testDir, directory)
    debug(fullPath)
    process.chdir(fullPath)
    params.formatter.success()
  } catch (e) {
    debug(e)
    if (e.code === 'ENOENT') {
      params.formatter.error(`directory ${directory} not found`)
    } else {
      params.formatter.error(e.message)
    }
    throw e
  }
}