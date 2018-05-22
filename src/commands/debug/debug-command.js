// @flow

import type { Configuration } from '../../configuration/configuration.js'

const { magenta } = require('chalk')
const extractActivities = require('../../activity-list/extract-activities.js')
const extractImagesAndLinks = require('../../activity-list/extract-images-and-links.js')
const getFileNames = require('../../finding-files/get-filenames.js')
const readAndParseFile = require('../../parsers/read-and-parse-file.js')

async function debugCommand (config: Configuration) {
  const filenames = getFileNames(config)
  if (filenames.length === 0) return

  const ASTs = await Promise.all(filenames.map(readAndParseFile))

  const activities = extractActivities(ASTs, config.classPrefix)
  const links = extractImagesAndLinks(ASTs)
  if (activities.length === 0 && links.length === 0) {
    console.log(magenta('no activities found'))
  }
}

module.exports = debugCommand
