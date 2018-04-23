// @flow

// Removes the given excluded files from the given list of filenames
module.exports = function removeExcludedFiles (
  fileList: string[],
  excluded: ?string
): string[] {
  if (!excluded) return fileList
  const excludedFilesArray = Array.isArray(excluded) ? excluded : [excluded]
  const excludedRegex = excludedFilesArray.map(file => new RegExp(file))
  return fileList.filter(file => {
    for (let excludedFile of excludedRegex) {
      return !excludedFile.test(file)
    }
  })
}
