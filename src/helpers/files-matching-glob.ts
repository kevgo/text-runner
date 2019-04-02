import glob from 'glob'
import { AbsoluteFilePath } from '../domain-model/absolute-file-path'

export function filesMatchingGlob(expression: string): AbsoluteFilePath[] {
  return glob
    .sync(expression)
    .sort()
    .map(file => new AbsoluteFilePath(file))
}
