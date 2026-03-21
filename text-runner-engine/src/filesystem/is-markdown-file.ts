import { promises as fs } from "node:fs"

export async function isMarkdownFile(filepath: string): Promise<boolean> {
  try {
    const fileStats = await fs.stat(filepath)
    return filepath.endsWith(".md") && fileStats.isFile()
  } catch (_e) {
    return false
  }
}
