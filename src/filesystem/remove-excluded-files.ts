import { AbsoluteFilePath } from "./absolute-file-path"

/**
 * Removes the given excluded files from the given list of filenames
 */
export function removeExcludedFiles(
  fileList: AbsoluteFilePath[],
  ...excluded: string[]
): AbsoluteFilePath[] {
  if (!excluded.includes("node_modules")) {
    excluded.push("node_modules")
  }
  const excludedRegexes = excluded.map(file => new RegExp(file))
  return fileList.filter(file => {
    for (const excludedRegex of excludedRegexes) {
      if (excludedRegex.test(file.unixified())) {
        return false
      }
    }
    return true
  })
}
