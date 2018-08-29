// @flow

const AbsoluteFilePath = require('./absolute-file-path.js')
const AbsoluteLink = require('./absolute-link.js')
const Publications = require('../configuration/publications.js')
const RelativeLink = require('./relative-link.js')
const removeDoubleSlash = require('../helpers/remove-double-slash.js')
const unixify = require('../helpers/unifixy.js')

// A link that isn't known yet whether it is relative or absolute
class UnknownLink {
  value: string

  constructor (publicPath: string) {
    this.value = removeDoubleSlash(unixify(publicPath))
  }

  absolutify (
    containingFile: AbsoluteFilePath,
    publications: Publications,
    defaultFile: string
  ): AbsoluteLink {
    if (this.isAbsolute()) return new AbsoluteLink(this.value)
    return new RelativeLink(this.value).absolutify(
      containingFile,
      publications,
      defaultFile
    )
  }

  // Returns whether this link is an absolute link
  isAbsolute (): boolean {
    return this.value.startsWith('/')
  }
}

module.exports = UnknownLink
