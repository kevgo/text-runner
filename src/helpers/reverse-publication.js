// @flow

import type { Publications } from '../configuration/configuration.js'

const addLeadingSlash = require('./add-leading-slash.js')
const path = require('path')
const unixifyPath = require('./unixify-path.js')

module.exports = function (
  filepath: string,
  publications: Publications
): string {
  var result = addLeadingSlash(unixifyPath(filepath))
  for (const publication of publications) {
    const publicPathRE = new RegExp('^' + publication.publicPath)
    if (!result.match(publicPathRE)) continue
    result = result.replace(publicPathRE, publication.localPath)
    if (path.extname(result) === publication.publicExtension) {
      const extRE = new RegExp(publication.publicExtension + '$')
      result = result.replace(extRE, '.md')
    }
    break
  }
  return result
}
