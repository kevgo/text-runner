import * as glob from "glob-promise"

import * as files from "."

export async function filesMatchingGlob(expression: string, sourceDir: string): Promise<files.FullFile[]> {
  const allFiles = await glob(expression)
  return allFiles
    .sort()
    .map(file => new files.AbsoluteFile(file))
    .map(file => file.toFullFile(sourceDir))
}
