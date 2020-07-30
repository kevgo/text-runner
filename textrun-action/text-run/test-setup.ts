import { ActionArgs } from "text-runner"
import { promises as fs } from "fs"
import path from "path"

export default async function testSetup(action: ActionArgs) {
  const codeBlocks = action.nodes.getNodesOfTypes("code")
  if (codeBlocks.length !== 3) {
    throw new Error(`Expected 3 code blocks, got ${codeBlocks.length}`)
  }
  console.log(codeBlocks)
  const pkgName = action.nodes.getNodesFor(codeBlocks[0]).text()
  const action1 = action.nodes.getNodesFor(codeBlocks[1]).text()
  const action2 = action.nodes.getNodesFor(codeBlocks[2]).text()
  console.log("ACTION1", action1)
  const dir = path.join(process.cwd(), action.nodes[0].attributes.dir)
  fs.mkdir(dir, { recursive: true })
  await fs.writeFile(
    path.join(dir, "package.json"),
    `\
{
  "name": "${pkgName}",
  "version": "0.0.0",
  "main": "index.js"
}`
  )
  await fs.writeFile(
    path.join(dir, "index.js"),
    `\
module.exports = {
  "${action1}": function() { console.log(1) },
  "${action2}": function() {}
}`
  )
}
