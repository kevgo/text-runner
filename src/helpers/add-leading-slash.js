// @flow

module.exports = function (filepath: string): string {
  if (filepath[0] === '/') {
    return filepath
  } else {
    return '/' + filepath
  }
}
