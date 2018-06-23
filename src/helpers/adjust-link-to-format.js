// @flow

module.exports = function (link: string, linkFormat: string): string {
  if (linkFormat === 'html') {
    return link.replace(/\.html$/, '.md')
  } else if (linkFormat === 'url-friendly') {
    return link + '.md'
  } else if (linkFormat === 'direct') {
    return link
  } else {
    throw new Error(`Unknown linkFormat configuration option: ${linkFormat}`)
  }
}
