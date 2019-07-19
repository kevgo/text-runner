import glob from "glob"
import { AbsoluteFilePath } from "../domain-model/absolute-file-path"

/**
 * Returns all the markdown files in the current working directory
 * @param fileGlob
 */
export function allMarkdownFiles(fileGlob: string): AbsoluteFilePath[] {
  return glob
    .sync(fileGlob)
    .filter(file => !file.includes("node_modules"))
    .sort()
    .map(file => new AbsoluteFilePath(file))
}
