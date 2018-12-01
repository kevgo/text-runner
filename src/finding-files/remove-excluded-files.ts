import AbsoluteFilePath from '../domain-model/absolute-file-path'

// Removes the given excluded files from the given list of filenames
export default function removeExcludedFiles(
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
      if (excludedRegex.test(file.unixified())) {
        return false
      }
    }
    return true
  })
}
