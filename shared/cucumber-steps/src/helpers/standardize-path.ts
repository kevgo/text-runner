export function standardizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/")
}
