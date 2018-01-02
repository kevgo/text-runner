// @flow

const {cyan} = require('chalk')
const mkdirp = require('mkdirp')
const path = require('path')
const debug = require('debug')('textrun:actions:create-directory')

module.exports = function (params: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  params.formatter.start('creating directory')

  const directoryName = params.searcher.nodeContent({type: 'code'}, ({nodes, content}) => {
    if (nodes.length === 0) return 'no name given for directory to create'
    if (nodes.length > 1) return `several names given: ${nodes.map((node) => node.content).map((a) => cyan(a)).join(' and ')}`
    if (!content) return 'empty name given for directory to create'
  })
  debug(`directory to create: ${directoryName}`)

  params.formatter.refine(`creating directory ${cyan(directoryName)}`)
  const fullPath = path.join(params.configuration.testDir, directoryName)
  debug(fullPath)
  try {
    mkdirp.sync(fullPath)
    params.formatter.success()
  } catch (err) {
    params.formatter.error(err)
    throw new Error('1')
  }
}
