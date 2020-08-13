import * as path from "path"

/** provides the top-level folder containing the given filename */
export function rootFolder(file: string): string {
  return path.dirname(file).split(path.sep)[0]
}
