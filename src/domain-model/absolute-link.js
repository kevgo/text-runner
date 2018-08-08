// @flow

const addLeadingDotUnlessEmpty = require('../helpers/add-leading-dot-unless-empty.js')
const addLeadingSlash = require('../helpers/add-leading-slash.js')
const path = require('path')
const RelativeLink = require('./relative-link.js')
const removeDoubleSlash = require('../helpers/remove-double-slash.js')
const unixify = require('../helpers/unifixy.js')

// Represents a link to another Markdown file,
// all the way from the root directory
// (i.e. a link starting with '/')
class AbsoluteLink {
  value: string

  constructor (value: string) {
    this.value = addLeadingSlash(removeDoubleSlash(unixify(value)))
  }

  // Returns a new link that consists of this link
  // with the given relative link appended
  add (segment: RelativeLink): AbsoluteLink {
    return new AbsoluteLink(this.value + '/' + segment.value)
  }

  // Returns another AbsoluteLink instance that uses the given file extension
  withExtension (newExtension: string): AbsoluteLink {
    const extRE = new RegExp(path.extname(this.value) + '$')
    return new AbsoluteLink(
      this.value.replace(extRE, addLeadingDotUnlessEmpty(newExtension))
    )
  }
}

module.exports = AbsoluteLink
