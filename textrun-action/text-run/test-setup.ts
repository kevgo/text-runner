import { ActionArgs } from "text-runner"
import { promises as fs } from "fs"
import path from "path"

export default async function testSetup(action: ActionArgs) {
  const codeBlocks = action.nodes.getNodesOfTypes("code")
  if (codeBlocks.length !== 2) {
    throw new Error(`Expected 2 code blocks, got ${codeBlocks.length}`)
  }
  const pkgName = action.nodes.getNodesFor(codeBlocks[0]).text()
  const action1 = action.nodes.getNodesFor(codeBlocks[1]).text()
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