import * as fs from "fs-extra"
import * as path from "path"

export async function scaffoldCommand(blockName: string | undefined): Promise<Error[]> {
  if (!blockName) {
    throw new Error("no region name given")
  }
  let textRunDirExists = true
  try {
    await fs.stat("text-run")
  } catch (e) {
    textRunDirExists = false
  }
  if (!textRunDirExists) {
    await fs.mkdir("text-run")
  }
  await fs.writeFile(path.join("text-run", blockName + ".js"), template(blockName), "utf8")
  return []
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
