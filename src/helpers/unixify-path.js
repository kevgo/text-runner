// @flow

module.exports = function (filepath: string): string {
  return filepath.replace(/\\/g, '/')
}
