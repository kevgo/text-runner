import * as color from "colorette"
import * as isGlob from "is-glob"
import * as path from "path"
import { Configuration } from "../configuration/types/configuration"
import { UnprintedUserError } from "../errors/unprinted-user-error"
import { AbsoluteFilePath } from "./absolute-file-path"
import { filesMatchingGlob } from "./files-matching-glob"
import { hasDirectory } from "./has-directory"
import { isMarkdownFile } from "./is-markdown-file"
import { markdownFilesInDir } from "./markdown-files-in-dir"
import { removeExcludedFiles } from "./remove-excluded-files"

/**
 * Returns the AbsoluteFilePaths of all files/directories relative to the given sourceDir
 * that match the given glob
 */
export async function getFileNames(config: Configuration): Promise<AbsoluteFilePath[]> {
  let filenames = await getFiles(config)
  filenames = removeExcludedFiles(filenames, config.exclude)
  return filenames
}

/**
 * Returns files described by the given configuration.
 * Filenames are relative to config.sourceDir.
 */
async function getFiles(config: Configuration): Promise<AbsoluteFilePath[]> {
  const fullGlob = path.join(config.sourceDir, config.fileGlob)
  if (config.fileGlob === "") {
    return markdownFilesInDir(config.sourceDir, config.sourceDir)
  } else if (await hasDirectory(fullGlob)) {
    return markdownFilesInDir(fullGlob, config.sourceDir)
  } else if (await isMarkdownFile(fullGlob)) {
    return [new AbsoluteFilePath(config.fileGlob)]
  } else if (isGlob(config.fileGlob)) {
    return filesMatchingGlob(fullGlob, config.sourceDir)
  } else {
    throw new UnprintedUserError(`file or directory does not exist: ${color.red(fullGlob)}`)
  }
}
