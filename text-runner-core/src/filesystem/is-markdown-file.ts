import { promises as fs } from "fs"

export async function isMarkdownFile(filepath: string): Promise<boolean> {
  try {
    const fileStats = await fs.stat(filepath)
    return filepath.endsWith(".md") && fileStats.isFile()
  } catch (e) {
    return false
  }
}
