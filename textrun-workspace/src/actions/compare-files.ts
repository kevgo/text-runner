import * as assertNoDiff from "assert-no-diff"
import { promises as fs } from "fs"
import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

export async function compareFiles(action: textRunner.actions.Args): Promise<void> {
  const have = action.region[0].attributes["have"]
  if (!have) {
    throw new textRunner.UserError("No have given", 'Please provide the file to verify via the "have" attribute')
  }
  const want = action.region[0].attributes["want"]
  if (!want) {
    throw new textRunner.UserError("No want given", 'Please provide the golden file via the "want" attribute')
  }

  action.name(`compare files ${styleText("cyan", have)} and ${styleText("cyan", want)}`)

  const haveContent = await readFile(have, action.configuration.workspace)
  const wantContent = await readFile(want, action.configuration.workspace)

  try {
    assertNoDiff.trimmedLines(haveContent.trim(), wantContent.trim())
  } catch (err) {
    action.log(haveContent)
    throw new textRunner.UserError(
      `mismatching content in ${styleText(["cyan", "bold"], have)}`,
      textRunner.errorMessage(err)
    )
  }
}

async function readFile(fileName: string, workspace: textRunner.files.AbsoluteDirPath): Promise<string> {
  const filePath = workspace.joinStr(fileName)
  try {
    return await fs.readFile(filePath, "utf-8")
  } catch (e) {
    if (!textRunner.isFsError(e)) {
      throw e
    }
    if (e.code === "ENOENT") {
      const files = await fs.readdir(workspace.platformified())
      throw new textRunner.UserError(
        `file not found: ${fileName}`,
        `the workspace has these files: ${files.join(", ")}`
      )
    } else {
      throw e
    }
  }
}
