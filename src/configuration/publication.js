// @flow

const AbsoluteLink = require('../domain-model/absolute-link.js')
const addLeadingDot = require('../helpers/add-leading-dot-unless-empty.js')
const addLeadingSlash = require('../helpers/add-leading-slash.js')
const addTrailingSlash = require('../helpers/add-trailing-slash.js')
const path = require('path')
const RelativeLink = require('../domain-model/relative-link.js')

// Defines the publication of a local file path to a public URL
class Publication {
  filePath: string
  urlPath: string
  urlExtension: string

  constructor (filePath: string, urlPath: string, urlExtension: string) {
    this.filePath = addLeadingSlash(addTrailingSlash(filePath))
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
    let result = link.rebase(this.urlPath, this.filePath)

    // add the default file
    if (result.isLinkToDirectory()) {
      result = result.add(new RelativeLink(defaultFile))
    }

    // replace the extension
    const extRE = new RegExp(path.extname(result) + '$')
    result = result.replace(extRE, '.md')
  }

  // Returns whether this publication maps the given link
  resolves (link: AbsoluteLink): boolean {
    return link.value.startsWith(this.urlPath)
  }
}

module.exports = Publication
const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
console.log(AbsoluteFilePath)
