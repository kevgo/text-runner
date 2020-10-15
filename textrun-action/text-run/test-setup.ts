import { promises as fs } from "fs"
import * as tr from "text-runner"

export default async function testSetup(action: tr.actions.Args): Promise<void> {
  const codeBlocks = action.region.nodesOfTypes("code")
  if (codeBlocks.length !== 2) {
    throw new Error(`Expected 2 code blocks, got ${codeBlocks.length}`)
  }
  const pkgName = action.region.nodesFor(codeBlocks[0]).text()
  const action1 = action.region.nodesFor(codeBlocks[1]).text()
  await fs.writeFile(
    action.configuration.workspace.joinStr("package.json"),
    `\
{
  "name": "${pkgName}",
  "version": "0.0.0",
  "main": "index.js"
}`
  )
  await fs.writeFile(
    action.configuration.workspace.joinStr("index.js"),
    `\
module.exports = {
  textrunActions: {
    "${action1}": function() { console.log(1) }
  }
}`
  )
}
