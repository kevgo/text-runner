// @flow

import type { Publications } from '../configuration/configuration.js'

// getPublicPath returns the public path for the given local path, based on the given publication mappings.
module.exports = function getPublicPath(localPath: string, publications: Publications): string {
  for (const publication of publications) {
    if (!localPath.startsWith(publication.localPath)) continue
    return localPath.replace(new RegExp('^' + publication.localPath), publication.publicPath)
  }
}
