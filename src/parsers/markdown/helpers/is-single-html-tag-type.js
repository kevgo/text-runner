// @flow

module.exports = function isSingleHtmlTagType (tagName: string) {
  return tagName === 'img' || tagName === 'br'
}
