// @flow

const {bold, cyan} = require('chalk')
const path = require('path')
const debug = require('debug')('textrun:actions:cd')

// Changes the current working directory to the one given in the hyperlink or code block
module.exports = function (activity: Activity) {
  activity.formatter.start('changing the current working directory')
  var directory
  directory = activity.searcher.tagContent(['link_open', 'code'])
  activity.formatter.refine(`changing into the ${bold(cyan(directory))} directory`)
  activity.formatter.output(`cd ${directory}`)
  const fullPath = path.join(activity.configuration.testDir, directory)
  debug(`changing into directory '${fullPath}`)
  try {
    process.chdir(fullPath)
    activity.formatter.success()
  } catch (e) {
    if (e.code === 'ENOENT') throw new Error(`directory ${directory} not found`)
    throw e
  }
}
