import * as tr from "text-runner-core"
import { promises as fs } from "fs"
import * as path from "path"

export default async function testSetup(action: tr.ActionArgs) {
  const codeBlocks = action.region.getNodesOfTypes("code")
  if (codeBlocks.length !== 2) {
    throw new Error(`Expected 2 code blocks, got ${codeBlocks.length}`)
  }
  const pkgName = action.region.getNodesFor(codeBlocks[0]).text()
  const action1 = action.region.getNodesFor(codeBlocks[1]).text()
  await fs.writeFile(
    path.join(action.configuration.workspace, "package.json"),
    `\
{
  "name": "${pkgName}",
  "version": "0.0.0",
  "main": "index.js"
}`
  )
  await fs.writeFile(
    path.join(action.configuration.workspace, "index.js"),
    `\
module.exports = {
  textrunActions: {
    "${action1}": function() { console.log(1) }
  }
}`
  )
}
