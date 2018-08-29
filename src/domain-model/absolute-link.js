// @flow

const AbsoluteFilePath = require('./absolute-file-path.js')
const addLeadingDotUnlessEmpty = require('../helpers/add-leading-dot-unless-empty.js')
const addLeadingSlash = require('../helpers/add-leading-slash.js')
const path = require('path')
const Publications = require('../configuration/publications.js')
const RelativeLink = require('./relative-link.js')
const removeDoubleSlash = require('../helpers/remove-double-slash.js')
const straightenLink = require('../helpers/straighten-link.js')
const unixify = require('../helpers/unifixy.js')

// Represents a link to another Markdown file,
// all the way from the root directory
// (i.e. a link starting with '/')
module.exports = class AbsoluteLink {
  value: string

  constructor (publicPath: string) {
    this.value = addLeadingSlash(removeDoubleSlash(unixify(publicPath)))
  }

  // Returns the anchor part of this link
  anchor (): string {
    return this.value.split('#')[1] || ''
  }

  // Returns a new link that consists of this link
  // with the given relative link appended
  append (segment: RelativeLink): AbsoluteLink {
    return new AbsoluteLink(straightenLink(this.value + '/' + segment.value))
  }

  // Returns a link to the containing directory
  directory (): AbsoluteLink {
    const withoutAnchor = this.withoutAnchor()
    if (withoutAnchor.isLinkToDirectory()) return withoutAnchor
    return new AbsoluteLink(
      withoutAnchor.value.substr(0, withoutAnchor.value.lastIndexOf('/') + 1)
    )
  }

  hasAnchor (): boolean {
    return this.anchor() !== ''
  }

  // Returns whether this link has the given extension
  hasExtension (extension: string): boolean {
    return path.extname(this.value) === addLeadingDotUnlessEmpty(extension)
  }

  // Returns whether this link points to a directory
  isLinkToDirectory (): boolean {
    return this.value.endsWith('/')
  }

  // Returns the file path that this link has on the local filesystem
  localize (publications: Publications, defaultFile: string): AbsoluteFilePath {
    const publication = publications.publicationForLink(this)
    let result = publication
      ? publication.resolve(this.urlDecoded(), defaultFile)
      : new AbsoluteFilePath(this.urlDecoded().withoutAnchor().value)

    // append the default file
    if (result.extName() === '' && defaultFile) {
      result = result.append(defaultFile)
    }
    return result
  }

  // Returns a link where the old enclosing directory is replaced
  // with the new enclosing directory
  rebase (oldPath: string, newPath: string): AbsoluteLink {
    const re = new RegExp('^' + oldPath)
    return new AbsoluteLink(this.value.replace(re, newPath))
  }

  urlDecoded (): AbsoluteLink {
    return new AbsoluteLink(decodeURI(this.value))
  }

  // Returns a link that contains the given anchor
  withAnchor (anchor: string): AbsoluteLink {
    return new AbsoluteLink(this.withoutAnchor().value + '#' + anchor)
  }

  // Returns another AbsoluteLink instance that uses the given file extension
  withExtension (newExtension: string): AbsoluteLink {
    const extRE = new RegExp(path.extname(this.value) + '$')
    return new AbsoluteLink(
      this.value.replace(extRE, addLeadingDotUnlessEmpty(newExtension))
    )
  }

  // Returns a link that is this link without the anchor
  withoutAnchor (): AbsoluteLink {
    return new AbsoluteLink(this.value.split('#')[0])
  }
}
