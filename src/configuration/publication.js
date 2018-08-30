// @flow

const AbsoluteLink = require('../domain-model/absolute-link.js')
const addLeadingDotUnlessEmpty = require('../helpers/add-leading-dot-unless-empty.js')
const addLeadingSlash = require('../helpers/add-leading-slash.js')
const addTrailingSlash = require('../helpers/add-trailing-slash.js')
const RelativeLink = require('../domain-model/relative-link.js')

// Defines the publication of a local file path to a public URL
class Publication {
  localPath: string
  publicPath: string
  publicExtension: string

  constructor (localPath: string, publicPath: string, publicExtension: string) {
    this.localPath = addLeadingSlash(addTrailingSlash(localPath))
    this.publicPath = addLeadingSlash(publicPath)
    this.publicExtension = addLeadingDotUnlessEmpty(publicExtension)
  }

  // Returns the public link under which the given file path would be published
  // according to the rules of this publication
  publish (localPath: AbsoluteFilePath): AbsoluteLink {
    const re = new RegExp('^' + this.localPath)
    const linkPath = addLeadingSlash(localPath.unixified()).replace(
      re,
      this.publicPath
    )
    const result = new AbsoluteLink(linkPath)
    if (this.publicExtension == null) return result
    return result.withExtension(this.publicExtension)
  }

  // Returns whether this publication applies to the given file path
  publishes (localPath: AbsoluteFilePath): boolean {
    return addLeadingSlash(addTrailingSlash(localPath.unixified())).startsWith(
      this.localPath
    )
  }

  // returns the localPath for the given link,
  // mapped according to the rules of this publication
  resolve (link: AbsoluteLink, defaultFile: string): AbsoluteFilePath {
    let result = link.rebase(this.publicPath, this.localPath)
    result = result.withoutAnchor()

    if (result.isLinkToDirectory() && !result.hasAnchor()) {
      result = result.append(new RelativeLink(defaultFile))
    } else if (result.isLinkToDirectory() && result.hasAnchor()) {
      result = result
        .directory()
        .append(new RelativeLink(defaultFile))
        .withAnchor(result.anchor())
    } else if (result.hasExtension(this.publicExtension)) {
      result = result.withExtension('md')
    }

    return new AbsoluteFilePath(result.value)
  }

  // Returns whether this publication maps the given link
  resolves (link: AbsoluteLink): boolean {
    return link.value.startsWith(this.publicPath)
  }
}

module.exports = Publication
const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
