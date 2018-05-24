// @flow

// Removes the given excluded files from the given list of filenames
module.exports = function removeExcludedFiles (
  fileList: string[],
  excluded: string | string[]
): string[] {
  const excludedFilesArray = Array.isArray(excluded) ? excluded : [excluded]
  if (!excludedFilesArray.includes('node_modules')) {
    excludedFilesArray.push('node_modules')
  }
  const excludedRegexes = excludedFilesArray.map(file => new RegExp(file))
  return fileList.filter(file => {
    for (const excludedRegex of excludedRegexes) {
      if (excludedRegex.test(file)) return false
    }
    return true
  })
}
