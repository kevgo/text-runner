import * as glob from "glob-promise"

import * as helpers from "../helpers"
import { AbsoluteFilePath } from "./absolute-file-path"

export async function filesMatchingGlob(expression: string, sourceDir: string): Promise<AbsoluteFilePath[]> {
  const files = await glob(expression)
  return files
    .sort()
    .map(file => helpers.pathRelativeToDir(file, sourceDir))
    .map(file => new AbsoluteFilePath(file))
}
