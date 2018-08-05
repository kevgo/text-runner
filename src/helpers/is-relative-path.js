// @flow

module.exports = function isRelativePath(filepath: string): boolean {
  return !filepath.startsWith('/') && !filepath.startsWith('\\')
}
