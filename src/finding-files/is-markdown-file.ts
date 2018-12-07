import fs from 'fs'
import path from 'path'
import util from 'util'

export default async function(filename: string): Promise<boolean> {
  try {
    const filepath = path.join(process.cwd(), filename)
    const fileStat = await util.promisify(fs.stat)(filepath)
    return filename.endsWith('.md') && fileStat.isFile()
  } catch (e) {
    return false
  }
}
