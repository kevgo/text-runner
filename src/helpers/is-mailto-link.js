// @flow

module.exports = function isMailtoLink (target: string): boolean {
  return target.startsWith('mailto:')
}
