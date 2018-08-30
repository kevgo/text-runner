// @flow

const AbsoluteFilePath = require('./absolute-file-path.js')
const AbsoluteLink = require('./absolute-link.js')
const Publications = require('../configuration/publications.js')

// A link relative to the current location,
// i.e. a link not starting with '/'
class RelativeLink {
  value: string

  constructor (publicPath: string) {
    this.value = publicPath
  }

  // Assuming this relative link is in the given file,
  // returns the absolute links that point to the same target as this relative link.
  absolutify (
    containingFile: AbsoluteFilePath,
    publications: Publications,
    defaultFile: string
  ): AbsoluteLink {
    const urlOfDir = containingFile
      .directory()
      .publicPath(publications, defaultFile)
    return urlOfDir.append(this)
  }
}

module.exports = RelativeLink
