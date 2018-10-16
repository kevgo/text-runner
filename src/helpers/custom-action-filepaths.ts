import glob from "glob"
import path from "path"
import javascriptExtensions from "./javascript-extensions"

export default function customActionFilePaths(): string[] {
  const pattern = path.join(
    process.cwd(),
    "text-run",
    `*.@(${javascriptExtensions().join("|")})`
  )
  return glob.sync(pattern)
}
