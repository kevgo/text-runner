// @flow

const {cyan} = require('chalk')
const fs = require('fs')
const jsYaml = require('js-yaml')
const minimum = require('../../helpers/minimum.js')

module.exports = function (activity: Activity) {
  activity.formatter.action('determining minimum supported NodeJS version')

  const documentedVersion = parseInt(activity.searcher.tagContent('text'))
  if (isNaN(documentedVersion)) throw new Error('given Node version is not a number')
  activity.formatter.action(`determining whether minimum supported NodeJS version is ${cyan(documentedVersion)}`)

  var supportedVersion
  try {
    supportedVersion = getSupportedVersion()
    activity.formatter.action(`requires at least Node ${cyan(supportedVersion)}`)
  } catch (err) {
    throw new Error(err.message)
  }
  if (supportedVersion !== documentedVersion) {
    throw new Error(`documented minimum Node version is ${cyan(documentedVersion)}, should be ${cyan(supportedVersion)}`)
  }
}

function getSupportedVersion () {
  const content = loadYmlFile('.travis.yml')
  if (!content) throw new Error('.travis.yml is empty')
  const minimumVersion = parseInt(minimum(content.node_js))
  if (isNaN(minimumVersion)) throw new Error('listed version is not a number')
  return minimumVersion
}

function loadYmlFile (filename: string) {
  const fileContent = fs.readFileSync(filename, {encoding: 'utf8'})
  return jsYaml.safeLoad(fileContent)
}
