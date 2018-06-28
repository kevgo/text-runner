// @flow

module.exports = function (text: string): string {
  if (!text.startsWith('/')) return text
  return text.slice(1)
}
