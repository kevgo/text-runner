import * as color from "colorette"
import * as isGlob from "is-glob"
import * as path from "path"
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
export async function getFileNames(config: Configuration): Promise<AbsoluteFilePath[]> {
  let filenames = await getFiles(config)
  filenames = removeExcludedFiles(filenames, config.exclude)
  return filenames
}

async function getFiles(config: Configuration): Promise<AbsoluteFilePath[]> {
  const relative = path.relative(process.cwd(), config.sourceDir)
  const fullGlob = path.join(relative, config.fileGlob)
  if (config.fileGlob === "") {
    return allMarkdownFiles(fullGlob)
  } else if (await hasDirectory(fullGlob)) {
    return markdownFilesInDir(fullGlob)
  } else if (await isMarkdownFile(fullGlob)) {
    return [new AbsoluteFilePath(fullGlob)]
  } else if (isGlob(config.fileGlob)) {
    return filesMatchingGlob(fullGlob)
  } else {
    throw new UnprintedUserError(`file or directory does not exist: ${color.red(config.fileGlob)}`)
  }
}
