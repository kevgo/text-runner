import { globby } from "globby"
import isGlob from "is-glob"

import * as configuration from "../configuration/index.js"
import { UserError } from "../errors/user-error.js"
import * as files from "./index.js"

/**
 * Returns the FullPaths of all files/directories relative to the given sourceDir
 * that match the given glob
 */
export async function getFileNames(config: configuration.Data): Promise<files.FullFilePath[]> {
  let filenames = await getFiles(config)
  filenames = removeExcludedFiles(filenames, config.exclude)
  filenames = removeExcludedFiles(filenames, "node_modules")
  if (config.emptyWorkspace === false) {
    if (!config.workspace.matches(config.sourceDir)) {
      const fullWorkspace = config.workspace.toFullDir(config.sourceDir)
      filenames = removeExcludedFiles(filenames, fullWorkspace.platformified())
    }
  }
  return filenames
}

/**
 * Returns files described by the given configuration.
 * Filenames are relative to config.sourceDir.
 */
async function getFiles(config: configuration.Data): Promise<files.FullFilePath[]> {
  const fullGlob = config.sourceDir.joinStr(config.files)
  if (config.files === "") {
    return markdownFilesInDir("", config.sourceDir)
  } else if (await files.hasDirectory(fullGlob)) {
    return markdownFilesInDir(fullGlob, config.sourceDir)
  } else if (await files.isMarkdownFile(fullGlob)) {
    return [new files.FullFilePath(config.files)]
  } else if (isGlob(config.files)) {
    return config.sourceDir.fullFilesMatchingGlob(fullGlob)
  } else {
    throw new UserError(
      `file or directory does not exist: ${config.files}`,
      "You can provide a glob expression or the path to a file or folder."
    )
  }
}

/**
 * returns all the markdown files in this directory and its children,
 * relative to the given sourceDir
 */
export async function markdownFilesInDir(dirName: string, sourceDir: files.SourceDir): Promise<files.FullFilePath[]> {
  const allFiles = await globby(`${dirName}/**/*.md`)
  return allFiles
    .filter(file => !file.includes("node_modules"))
    .sort()
    .map(file => new files.AbsoluteFilePath(file).toFullFile(sourceDir))
}

/** Removes the given excluded files from the given list of filenames */
export function removeExcludedFiles(fileList: files.FullFilePath[], excluded: string | string[]): files.FullFilePath[] {
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
