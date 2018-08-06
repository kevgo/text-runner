// @flow

import type { Publications } from '../configuration/configuration.js'

const path = require('path')

// returns the public path for the given local path,
// based on the given publication mappings
module.exports = function localToPublicFilePath (
  localPath: string,
  publications: Publications,
  defaultFile: string
): string {
  for (const publication of publications) {
    if (!localPath.startsWith(publication.localPath)) continue
    let result = localPath.replace(
      new RegExp('^' + publication.localPath),
      publication.publicPath
    )
    result = result.replace(/\/+/g, '/')
    if (path.basename(result) === defaultFile) return path.dirname(result)
    return result.replace(
      new RegExp(path.extname(result) + '$'),
      publication.publicExtension
    )
  }
  return localPath
}
