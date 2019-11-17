import color from "colorette"
import isGlob from "is-glob"
import { Configuration } from "../configuration/types/configuration"
import { UnprintedUserError } from "../errors/unprinted-user-error"
import { AbsoluteFilePath } from "./absolute-file-path"
import { allMarkdownFiles } from "./all-markdown-files"
import { filesMatchingGlob } from "./files-matching-glob"
import { hasDirectory } from "./has-directory"
import { isMarkdownFile } from "./is-markdown-file"
import { markdownFilesInDir } from "./markdown-files-in-dir"
import { removeExcludedFiles } from "./remove-excluded-files"

/**
 * Returns the name of all files/directories that match the given glob
 */
export async function getFileNames(
  config: Configuration
): Promise<AbsoluteFilePath[]> {
  let filenames = await getFiles(config)
  filenames = removeExcludedFiles(filenames, ...config.exclude)
  return filenames
}

async function getFiles(config: Configuration): Promise<AbsoluteFilePath[]> {
  if (config.fileGlob === "") {
    return allMarkdownFiles(config.fileGlob)
  } else if (await hasDirectory(config.fileGlob)) {
    return markdownFilesInDir(config.fileGlob)
  } else if (await isMarkdownFile(config.fileGlob)) {
    return [new AbsoluteFilePath(config.fileGlob)]
  } else if (isGlob(config.fileGlob)) {
    return filesMatchingGlob(config.fileGlob)
  } else {
    throw new UnprintedUserError(
      `file or directory does not exist: ${color.red(config.fileGlob)}`
    )
  }
}
