// @flow

const {cyan} = require('chalk')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const debug = require('debug')('textrun:actions:create-file')

module.exports = function (activity: Activity) {
  activity.formatter.action('creating file')

  const filePath = activity.searcher.nodeContent({types: ['emphasizedtext', 'strongtext']}, ({nodes, content}) => {
    if (nodes.length === 0) return 'no path given for file to create'
    if (nodes.length > 1) return `several file paths found: ${nodes.map((node) => node.content).map((word) => cyan(word)).join(' and ')}`
    if (!content) return 'no path given for file to create'
  })

  const content = activity.searcher.nodeContent({types: ['fence', 'code']}, ({nodes, content}) => {
    if (nodes.length === 0) return 'no content given for file to create'
    if (nodes.length > 1) return 'found multiple content blocks for file to create, please provide only one'
    if (!content) return 'no content given for file to create'
  })

  activity.formatter.action(`creating file ${cyan(filePath)}`)
  const fullPath = path.join(activity.configuration.testDir, filePath)
  debug(fullPath)
  mkdirp.sync(path.dirname(fullPath))
  fs.writeFileSync(fullPath, content)
}
