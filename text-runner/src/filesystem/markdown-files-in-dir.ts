import * as glob from "glob-promise"
import { AbsoluteFilePath } from "./absolute-file-path"

/**
 * Returns all the markdown files in this directory and its children
 */
export async function markdownFilesInDir(dirName: string): Promise<AbsoluteFilePath[]> {
  const files = await glob(`${dirName}/**/*.md`)
  return files
    .filter((file) => !file.includes("node_modules"))
    .sort()
    .map((file) => new AbsoluteFilePath(file))
}
