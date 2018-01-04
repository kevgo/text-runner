// @flow

const {cyan} = require('chalk')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const debug = require('debug')('textrun:actions:create-file')

module.exports = function (params: Activity) {
  params.formatter.action('creating file')
  const filePath = params.searcher.tagContent(['emphasizedtext', 'strongtext'])
  const content = params.searcher.tagContent(['fence', 'code'])
  params.formatter.action(`creating file ${cyan(filePath)}`)
  const fullPath = path.join(params.configuration.testDir, filePath)
  debug(fullPath)
  mkdirp.sync(path.dirname(fullPath))
  fs.writeFileSync(fullPath, content)
}
