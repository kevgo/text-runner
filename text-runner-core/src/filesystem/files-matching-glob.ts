import * as glob from "glob-promise"

import * as helpers from "../helpers"
import * as files from "."

export async function filesMatchingGlob(expression: string, sourceDir: string): Promise<files.FullFile[]> {
  const allFiles = await glob(expression)
  return allFiles
    .sort()
    .map(file => helpers.pathRelativeToDir(file, sourceDir))
    .map(file => new files.FullFile(file))
}
