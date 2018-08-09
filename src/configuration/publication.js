// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const AbsoluteLink = require('../domain-model/absolute-link.js')
const addLeadingDot = require('../helpers/add-leading-dot-unless-empty.js')
const addLeadingSlash = require('../helpers/add-leading-slash.js')
const path = require('path')

// Defines the publication of a local file path to a public URL
class Publication {
  filePath: string
  urlPath: string
  urlExtension: string

  constructor (filePath: string, urlPath: string, urlExtension: string) {
    this.filePath = addLeadingSlash(filePath)
    this.urlPath = addLeadingSlash(urlPath)
    this.urlExtension = urlExtension ? addLeadingDot(urlExtension) : '.md'
  }

  // Returns the public link under which the given file path would be published
  // according to the rules of this publication
  publish (filePath: AbsoluteFilePath): AbsoluteLink {
    const re = new RegExp('^' + this.filePath)
    const linkPath = filePath.unixified().replace(re, this.urlPath)
    const result = new AbsoluteLink(linkPath)
    if (this.urlExtension == null) return result
    return result.withExtension(this.urlExtension)
  }

  // Returns whether this publication applies to the given file path
  publishes (filePath: AbsoluteFilePath): boolean {
    return filePath.unixified().startsWith(this.filePath)
  }

  // returns the filePath for the given link,
  // mapped according to the rules of this publication
  resolve (link: AbsoluteLink, defaultFile: string): AbsoluteFilePath {
    let result = link.value

    // replace the path
    const urlPathRE = new RegExp('^' + this.urlPath)
    result = result.replace(urlPathRE, this.filePath)

    // replace the extension
    if (path.extname(result) === this.urlExtension) {
      const extRE = new RegExp(this.urlExtension + '$')
      result = result.replace(extRE, '.md')
    }
    return new AbsoluteFilePath(result)
  }

  // Returns whether this publication maps the given link
  resolves (link: AbsoluteLink): boolean {
    return link.value.startsWith(this.urlPath)
  }
}

module.exports = Publication
