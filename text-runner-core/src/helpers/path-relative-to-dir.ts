import * as path from "path"

export function pathRelativeToDir(file: string, dir: string): string {
  const fileDir = path.dirname(file)
  const fileName = path.basename(file)
  const relDir = path.relative(dir, fileDir)
  return path.join(relDir, fileName)
}
