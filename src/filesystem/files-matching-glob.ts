import glob from "glob-promise"
import { AbsoluteFilePath } from "./absolute-file-path"

export async function filesMatchingGlob(
  expression: string
): Promise<AbsoluteFilePath[]> {
  const files = await glob(expression)
  return files.sort().map(file => new AbsoluteFilePath(file))
}
