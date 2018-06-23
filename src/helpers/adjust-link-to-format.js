// @flow

module.exports = function (link: string, linkFormat: string): string {
  switch (linkFormat) {
    case 'html':
      return link.replace(/\.html$/, '.md')
    case 'url-friendly':
      return link + '.md'
    case 'direct':
      return link
    default:
      throw new Error(`Unknown linkFormat configuration option: ${linkFormat}`)
  }
}
