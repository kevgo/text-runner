import fs from "fs-extra"
import path from "path"

export async function isMarkdownFile(filename: string): Promise<boolean> {
  try {
    const filepath = path.join(process.cwd(), filename)
    const fileStats = await fs.stat(filepath)
    return filename.endsWith(".md") && fileStats.isFile()
  } catch (e) {
    return false
  }
}
