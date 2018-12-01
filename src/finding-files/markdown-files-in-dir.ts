import glob from 'glob'
import AbsoluteFilePath from '../domain-model/absolute-file-path'

// Returns all the markdown files in this directory and its children
export default function markdownFilesInDir(
  dirName: string
): AbsoluteFilePath[] {
  const files = glob.sync(`${dirName}/**/*.md`)
  return files
    .filter(file => !file.includes('node_modules'))
    .sort()
    .map(file => new AbsoluteFilePath(file))
}
