import * as path from "path"
import { promises as fs } from "fs"
import { ExecuteResult } from "../runners/execute-result"
import { camelize } from "../helpers/camelize"
import { UserProvidedConfiguration } from "../configuration/user-provided-configuration"

export async function scaffoldCommand(config: UserProvidedConfiguration): Promise<ExecuteResult> {
  if (!config.files) {
    throw new Error("no action name given")
  }
  const dirPath = path.join(config.sourceDir || ".", "text-run")
  let textRunDirExists = true
  try {
    await fs.stat(dirPath)
  } catch (e) {
    textRunDirExists = false
  }
  if (!textRunDirExists) {
    await fs.mkdir(dirPath, { recursive: true })
  }
  if (config.scaffoldSwitches?.ts) {
    await fs.writeFile(path.join(dirPath, config.files + ".ts"), tsTemplate(config.files), "utf8")
  } else {
    await fs.writeFile(path.join(dirPath, config.files + ".js"), jsTemplate(config.files), "utf8")
  }
  return ExecuteResult.empty()
}

function jsTemplate(filename: string) {
  return `module.exports = function ${camelize(filename)} (action) {
  console.log("This is the implementation of the "${filename}" action.")
  console.log('Text inside the semantic document region:', action.region.text())
  console.log("For more information see")
  console.log("https://github.com/kevgo/text-runner/blob/master/documentation/user-defined-actions.md")
}`
}

function tsTemplate(filename: string) {
  return `import { ActionArgs } from "text-runner"

export function ${camelize(filename)} (action: ActionArgs) {
  console.log("This is the implementation of the "${filename}" action.")
  console.log('Text inside the semantic document region:', action.region.text())
  console.log("For more information see")
  console.log("https://github.com/kevgo/text-runner/blob/master/documentation/user-defined-actions.md")
}`
}
