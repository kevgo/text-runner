// @flow

const {cyan} = require('chalk')
const mkdirp = require('mkdirp')
const path = require('path')
const debug = require('debug')('textrun:actions:create-directory')

module.exports = function (params: Activity) {
  params.formatter.start('creating directory')

  const directoryName = params.searcher.tagContent('code')
  debug(`directory to create: ${directoryName}`)

  params.formatter.refine(`creating directory ${cyan(directoryName)}`)
  const fullPath = path.join(params.configuration.testDir, directoryName)
  debug(`directory to create: ${fullPath}`)
  mkdirp.sync(fullPath)
  params.formatter.success()
}
