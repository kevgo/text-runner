// @flow

import type { Publications } from '../configuration/configuration.js'

const addLeadingSlash = require('./add-leading-slash.js')
const localToPublicFilePath = require('./local-to-public-file-path.js')
const path = require('path')
const unixifyPath = require('./unixify-path.js')

module.exports = function relativeToAbsoluteLink (
  link: string,
  filePath: string,
  publications: Publications,
  defaultFile: string
): string {
  const urlOfDir = path.dirname(
    localToPublicFilePath(addLeadingSlash(filePath), publications, defaultFile)
  )
  const full = urlOfDir + '/' + link
  const dried = full.replace(/\/+/g, '/').replace(/\\+/g, '\\')
  const normalized = path.normalize(dried)
  return unixifyPath(normalized)
}
