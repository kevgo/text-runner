// @flow

const isClosingHtmlTagType = require('./is-closing-html-tag-type.js')

module.exports = function isOpeningHtmlTagType (tagName: string) {
  return !isClosingHtmlTagType(tagName)
}
