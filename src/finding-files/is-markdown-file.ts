import fs from 'fs'
import path from 'path'

export default function isMarkdownFile(filename: string): boolean {
  try {
    const filepath = path.join(process.cwd(), filename)
    return filename.endsWith('.md') && fs.statSync(filepath).isFile()
  } catch (e) {
    return false
  }
}
