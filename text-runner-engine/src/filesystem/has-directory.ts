import { promises as fs } from "fs"

export async function hasDirectory(dirname: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirname)
    return stats.isDirectory()
  } catch (e) {
    return false
  }
}
