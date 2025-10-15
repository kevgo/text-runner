import { promises as fs } from "fs"
import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

export async function copyFile(action: textRunner.actions.Args): Promise<void> {
  const src = action.region[0].attributes["src"]
  if (!src) {
    throw new textRunner.UserError("No src given", "")
  }
  const dst = action.region[0].attributes["dst"]
  if (!dst) {
    throw new textRunner.UserError("No dst given", "")
  }
  action.name(`copy file ${styleText("cyan", src)} to ${styleText("cyan", dst)}`)
  const srcPath = action.configuration.workspace.joinStr(src)
  const dstPath = action.configuration.workspace.joinStr(dst)
  await fs.copyFile(srcPath, dstPath)
}
