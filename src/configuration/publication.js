// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const AbsoluteLink = require('../domain-model/absolute-link.js')

// Defines the publication of a local file path to a public URL
class Publication {
  filePath: string
  urlPath: string
  urlExtension: string

  constructor (filePath: string, urlPath: string, urlExtension: string) {
    this.filePath = filePath
    this.urlPath = urlPath
    this.urlExtension = urlExtension
  }

  // Returns the public link under which the given file path would be published
  // according to the rules of this publication
  publicPathFor (filePath: AbsoluteFilePath): AbsoluteLink {
    const pathRE = new RegExp('^' + this.filePath)
    const result = new AbsoluteLink(
      filePath.unixified().replace(pathRE, this.urlPath)
    )
    if (this.urlExtension == null) return result
    return result.withExtension(this.urlExtension)
  }

  // Returns whether this publication applies to the given file path
  publishes (filePath: AbsoluteFilePath): boolean {
    return filePath.unixified().startsWith(this.filePath)
  }
}

module.exports = Publication
