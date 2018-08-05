// @flow

import type { Publications } from '../configuration/configuration.js'

// getPublicPath returns the public path for the given local path, based on the given publication mappings.
module.exports = function localToPublicPath(localPath: string, publications: Publications): string {
  for (const publication of publications) {
    if (!localPath.startsWith(publication.localPath)) continue
    return localPath.replace(new RegExp('^' + publication.localPath), publication.publicPath)
  }
  throw new Error(`Could not find a publication that maps local path '${localPath}' to a public path`)
}
