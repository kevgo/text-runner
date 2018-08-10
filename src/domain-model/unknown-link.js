// @flow

const AbsoluteFilePath = require('./absolute-file-path.js')
const AbsoluteLink = require('./absolute-link.js')
const Publications = require('../configuration/publications.js')
const RelativeLink = require('./relative-link.js')
const removeDoubleSlash = require('../helpers/remove-double-slash.js')

// A link where it's not known if it is absolute or relative
class UnknownLink {
  value: string

  constructor (urlPath: string) {
    this.value = removeDoubleSlash(urlPath)
  }

  absolutify (
    containingFile: AbsoluteFilePath,
    publications: Publications,
    defaultFile: string
  ): AbsoluteLink {
    if (this.isAbsolute()) {
      return new AbsoluteLink(this.value)
    } else {
      return new RelativeLink(this.value).absolutify(
        containingFile,
        publications,
        defaultFile
      )
    }
  }

  // returns the anchor of the link
  anchor (): string {
    return this.value.split('#')[1] || ''
  }

  isAbsolute (): boolean {
    return this.value.startsWith('/')
  }
}

module.exports = UnknownLink
