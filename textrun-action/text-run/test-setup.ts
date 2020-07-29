import { ActionArgs } from "text-runner"
import { promises as fs } from "fs"
import path from "path"

export default async function testSetup(action: ActionArgs) {
  const codeBlocks = action.nodes.getNodesOfTypes("code")
  if (codeBlocks.length !== 3) {
    throw new Error(`Expected 3 code blocks, got ${codeBlocks.length}`)
  }
  const [pkgName, action1, action2] = codeBlocks
  const workspace = action.configuration.workspace
  await fs.writeFile(
    path.join(workspace, "package.json"),
    `\
{
  "name": "${pkgName}",
  "version": "0.0.0",
  "textrunActions": {
    "${action1}: function() {},
    "${action2}: function() {}
  }
}`
  )
}
