// @flow

import type {Activity} from '../commands/run/activity.js'

const {bold, cyan} = require('chalk')
const eol = require('eol')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function (activity: Activity) {
  const fileName = activity.searcher.tagContent('strongtext')
  const relativeBaseDir = activity.searcher.tagContent('link_open', {default: '.'})
  const expectedContent = activity.searcher.tagContent('fence')
  activity.formatter.setTitle(`verifying document content matches source code file ${cyan(fileName)}`)
  const filePath = path.join(path.dirname(activity.filename), relativeBaseDir, fileName)
  var actualContent
  try {
    actualContent = fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`file ${cyan(filePath)} not found`)
    } else {
      throw err
    }
  }
  try {
    jsdiffConsole(eol.lf(actualContent.trim()), eol.lf(expectedContent.trim()))
  } catch (err) {
    throw new Error(`mismatching content in ${cyan(bold(filePath))}:\n${err.message}`)
  }
}
