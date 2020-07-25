import glob from "glob-promise"
import { AbsoluteFilePath } from "./absolute-file-path"

/**
 * Returns all the markdown files in the current working directory
 * @param fileGlob
 */
export async function allMarkdownFiles(fileGlob: string): Promise<AbsoluteFilePath[]> {
  const files = await glob(fileGlob)
  return files
    .filter((file) => !file.includes("node_modules"))
    .sort()
    .map((file) => new AbsoluteFilePath(file))
}
