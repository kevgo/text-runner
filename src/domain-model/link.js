// @flow

const removeDoubleSlash = require('../helpers/remove-double-slash.js')
const unixify = require('../helpers/unifixy.js')

class UnknownLink {
  value: string

  constructor (urlPath: string) {
    this.value = removeDoubleSlash(unixify(urlPath))
  }

  absolutify (): AbsoluteLink {}
}

module.exports = Link
