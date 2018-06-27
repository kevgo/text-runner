// @flow

import type { Publications } from '../configuration/configuration.js'

const addLeadingSlash = require('./add-leading-slash.js')
const path = require('path')

module.exports = function (
  filepath: string,
  publications: Publications
): string {
  var result = addLeadingSlash(filepath)
  console.log(publications)
  for (const publication of publications) {
    const publicPathRE = new RegExp(`^${publication.publicPath}`)
    const match = result.match(publicPathRE)
    if (!match) continue
    result = result.replace(publicPathRE, publication.localPath)
    if (path.extname(result) === publication.publicExtension) {
      const extRE = new RegExp(publication.publicExtension + '$')
      result = result.replace(extRE, '.md')
    }
    break
  }
  return result
}
