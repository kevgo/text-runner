import * as glob from "glob-promise"

import * as helpers from "../helpers"
import { FullPath } from "./full-path"

export async function filesMatchingGlob(expression: string, sourceDir: string): Promise<FullPath[]> {
  const files = await glob(expression)
  return files
    .sort()
    .map(file => helpers.pathRelativeToDir(file, sourceDir))
    .map(file => new FullPath(file))
}
