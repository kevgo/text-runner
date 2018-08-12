// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')

// Removes the given excluded files from the given list of filenames
module.exports = function removeExcludedFiles (
  fileList: AbsoluteFilePath[],
  excluded: string | string[]
): AbsoluteFilePath[] {
  const excludedFilesArray = Array.isArray(excluded) ? excluded : [excluded]
  if (!excludedFilesArray.includes('node_modules')) {
    excludedFilesArray.push('node_modules')
  }
  const excludedRegexes = excludedFilesArray.map(file => new RegExp(file))
  return fileList.filter(file => {
    for (const excludedRegex of excludedRegexes) {
      if (excludedRegex.test(file.unixified())) return false
    }
    return true
  })
}
