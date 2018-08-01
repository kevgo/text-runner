// @flow

import type { Publications } from '../configuration/configuration.js'

const addLeadingSlash = require('./add-leading-slash.js')
const path = require('path')
const unixifyPath = require('./unixify-path.js')

module.exports = function (
  filepath: string,
  publications: Publications,
  defaultFile: string
): string {
  var result = addLeadingSlash(unixifyPath(filepath))
  for (const publication of publications) {
    const publicPathRE = new RegExp('^' + publication.publicPath)
    if (!result.match(publicPathRE)) continue
    result = result.replace(publicPathRE, publication.localPath)
    if (path.extname(result) === publication.publicExtension && !defaultFile) {
      const extRE = new RegExp(publication.publicExtension + '$')
      result = result.replace(extRE, '.md')
    }
    break
  }

  if (path.extname(result) === '' && defaultFile) {
    result = unixifyPath(path.join(result, defaultFile))
  }
  return result
}
