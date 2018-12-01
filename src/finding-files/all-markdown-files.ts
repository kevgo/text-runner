import glob from 'glob'
import AbsoluteFilePath from '../domain-model/absolute-file-path'

// Returns all the markdown files in the current working directory
export default function(configuredFiles: string): AbsoluteFilePath[] {
  return glob
    .sync(configuredFiles)
    .filter(file => !file.includes('node_modules'))
    .sort()
    .map(file => new AbsoluteFilePath(file))
}
