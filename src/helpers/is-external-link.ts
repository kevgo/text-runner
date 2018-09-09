import url from 'url'

module.exports = function isExternalLink(target: string): boolean {
  return target.startsWith('//') || !!url.parse(target).protocol
}
