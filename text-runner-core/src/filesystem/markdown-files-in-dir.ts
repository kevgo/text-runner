import * as glob from "glob-promise"
import { AbsoluteFilePath } from "./absolute-file-path"
import { pathRelativeToDir } from "./helpers/path-relative-to-dir"

/**
 * returns all the markdown files in this directory and its children,
 * relative to the given sourceDir
 */
export async function markdownFilesInDir(dirName: string, sourceDir: string): Promise<AbsoluteFilePath[]> {
  const files = await glob(`${dirName}/**/*.md`)
  return files
    .filter(file => !file.includes("node_modules"))
    .sort()
    .map(file => pathRelativeToDir(file, sourceDir))
    .map(file => new AbsoluteFilePath(file))
}
