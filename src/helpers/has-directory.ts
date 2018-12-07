import fs from 'fs'
import util from 'util'

export default async function hasDirectory(dirname: string): boolean {
  try {
    const fileStat = await util.promisify(fs.stat)(dirname)
    return fileStat.isDirectory()
  } catch (e) {
    return false
  }
}
