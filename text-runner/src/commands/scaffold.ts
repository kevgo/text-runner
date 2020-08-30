import * as path from "path"
import { promises as fs } from "fs"
import { ExecuteResult } from "../runners/execute-result"

export async function scaffoldCommand(actionName: string, sourceDir: string): Promise<ExecuteResult> {
  if (!actionName) {
    throw new Error("no action name given")
  }
  const dirPath = path.join(sourceDir, "text-run")
  let textRunDirExists = true
  try {
    await fs.stat(dirPath)
  } catch (e) {
    textRunDirExists = false
  }
  if (!textRunDirExists) {
    await fs.mkdir(dirPath, { recursive: true })
  }
  await fs.writeFile(path.join(dirPath, actionName + ".js"), template(actionName), "utf8")
  return ExecuteResult.empty()
}

function template(filename: string) {
  return `module.exports = async function (action) {
  console.log('This code runs inside the "${filename}" region implementation.')
  console.log('I found these elements in your document:')
  console.log(action.region)

  // capture content from the document
  // const content = activity.searcher.tagContent('boldtext')
  // do something with the content
  // action.log(content)
}
`
}
