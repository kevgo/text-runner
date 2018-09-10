import glob from "glob"
import javascriptExtensions from "./javascript-extensions.js"
import path from "path"

export default function customActionFilePaths(): string[] {
  const pattern = path.join(
    process.cwd(),
    "text-run",
    `*.@(${javascriptExtensions().join("|")})`
  )
  return glob.sync(pattern)
}
