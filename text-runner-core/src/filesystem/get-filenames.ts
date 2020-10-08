import * as glob from "glob-promise"
import * as isGlob from "is-glob"
import * as path from "path"

import * as configuration from "../configuration/index"
import { UserError } from "../errors/user-error"
import * as helpers from "../helpers"
import * as files from "./"

/**
 * Returns the FullPaths of all files/directories relative to the given sourceDir
 * that match the given glob
 */
export async function getFileNames(config: configuration.Data): Promise<files.FullFile[]> {
  let filenames = await getFiles(config)
  filenames = removeExcludedFiles(filenames, config.exclude)
  filenames = removeExcludedFiles(filenames, "node_modules")
  if (!config.emptyWorkspace) {
    const relativeWorkspace = path.relative(config.sourceDir, config.workspace)
    if (relativeWorkspace !== "") {
      filenames = removeExcludedFiles(filenames, relativeWorkspace)
    }
  }
  return filenames
}

/**
 * Returns files described by the given configuration.
 * Filenames are relative to config.sourceDir.
 */
async function getFiles(config: configuration.Data): Promise<files.FullFile[]> {
  const fullGlob = path.join(config.sourceDir, config.files)
  if (config.files === "") {
    return markdownFilesInDir(config.sourceDir, config.sourceDir)
  } else if (await files.hasDirectory(fullGlob)) {
    return markdownFilesInDir(fullGlob, config.sourceDir)
  } else if (await files.isMarkdownFile(fullGlob)) {
    return [new files.FullFile(config.files)]
  } else if (isGlob(config.files)) {
    return files.filesMatchingGlob(fullGlob, config.sourceDir)
  } else {
    throw new UserError(`file or directory does not exist: ${config.files}`)
  }
}

/**
 * returns all the markdown files in this directory and its children,
 * relative to the given sourceDir
 */
export async function markdownFilesInDir(dirName: string, sourceDir: string): Promise<files.FullFile[]> {
  const allFiles = await glob(`${dirName}/**/*.md`)
  return allFiles
    .filter(file => !file.includes("node_modules"))
    .sort()
    .map(file => helpers.pathRelativeToDir(file, sourceDir))
    .map(file => new files.FullFile(file))
}

/**
 * Removes the given excluded files from the given list of filenames
 */
export function removeExcludedFiles(fileList: files.FullFile[], excluded: string | string[]): files.FullFile[] {
  const excludedFilesArray = Array.isArray(excluded) ? excluded : [excluded]
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
