// @flow

// Removes the given excluded files from the given list of filenames
module.exports = function removeExcludedFiles (
  fileList: string[],
  excluded: string | string[]
): string[] {
  const excludedFilesArray = Array.isArray(excluded) ? excluded : [excluded]
  const excludedRegexes = excludedFilesArray.map(file => new RegExp(file))
  return fileList.filter(file => {
    for (let excludedFile of excludedRegexes) {
      return !excludedFile.test(file)
    }
  })
}
