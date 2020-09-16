import * as glob from "glob-promise"
import { AbsoluteFilePath } from "./absolute-file-path"
import { pathRelativeToDir } from "./helpers/path-relative-to-dir"

export async function filesMatchingGlob(expression: string, sourceDir: string): Promise<AbsoluteFilePath[]> {
  const files = await glob(expression)
  return files
    .sort()
    .map(file => pathRelativeToDir(file, sourceDir))
    .map(file => new AbsoluteFilePath(file))
}
