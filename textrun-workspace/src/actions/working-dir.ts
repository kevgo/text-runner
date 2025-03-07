import * as color from "colorette"
import * as textRunner from "text-runner-engine"

/** The "cd" action changes the current working directory to the one given in the hyperlink or code block. */
export function workingDir(action: textRunner.actions.Args): void {
  const directory = action.region.text()
  action.name(`changing into the ${color.cyan(directory)} directory`)
  const fullPath = action.configuration.workspace.joinStr(directory)
  action.log(`cd ${fullPath}`)
  try {
    process.chdir(fullPath)
  } catch (e) {
    if (!textRunner.isFsError(e)) {
      throw e
    }
    if (e.code === "ENOENT") {
      throw new Error(`directory ${directory} not found`)
    }
    throw e
  }
}
