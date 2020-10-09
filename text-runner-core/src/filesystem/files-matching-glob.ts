import * as glob from "glob-promise"

import * as files from "."

// TODO: make method of AbsoluteDir
export async function filesMatchingGlob(expression: string, sourceDir: files.AbsoluteDir): Promise<files.FullFile[]> {
  const allFiles = await glob(expression)
  return allFiles.sort().map(file => new files.AbsoluteFile(file).toFullFile(sourceDir))
}
