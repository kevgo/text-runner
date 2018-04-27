// @flow

module.exports = function getTagType (html: string): string {
  const matches = html.match(tagTypeRegex)
  if (!matches) {
    return ''
  }
  return matches[1]
}

const tagTypeRegex = /<(\/?\w+).*>/
