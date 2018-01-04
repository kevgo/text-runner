// @flow

const {cyan} = require('chalk')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const debug = require('debug')('textrun:actions:create-file')

module.exports = function (params: {configuration: Configuration, formatter: Formatter, searcher: Searcher}) {
  params.formatter.start('creating file')

  const filePath = params.searcher.nodeContent({types: ['emphasizedtext', 'strongtext']}, ({nodes, content}) => {
    if (nodes.length === 0) return 'no path given for file to create'
    if (nodes.length > 1) return `several file paths found: ${nodes.map((node) => node.content).map((word) => cyan(word)).join(' and ')}`
    if (!content) return 'no path given for file to create'
  })

  const content = params.searcher.nodeContent({types: ['fence', 'code']}, ({nodes, content}) => {
    if (nodes.length === 0) return 'no content given for file to create'
    if (nodes.length > 1) return 'found multiple content blocks for file to create, please provide only one'
    if (!content) return 'no content given for file to create'
  })

  params.formatter.refine(`creating file ${cyan(filePath)}`)
  const fullPath = path.join(params.configuration.testDir, filePath)
  debug(fullPath)
  mkdirp.sync(path.dirname(fullPath))
  fs.writeFileSync(fullPath, content)
}
