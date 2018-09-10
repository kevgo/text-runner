import AbsoluteFilePath from "../domain-model/absolute-file-path"
import glob from "glob"

export default function(expression: string): AbsoluteFilePath[] {
  return glob
    .sync(expression)
    .sort()
    .map(file => new AbsoluteFilePath(file))
}
