import path from "path"

export function trimExtension(filePath: string): string {
  return path.join(
    path.dirname(filePath),
    path.basename(filePath, path.extname(filePath))
  )
}
