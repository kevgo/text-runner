import color from "colorette"
import path from "path"
import { ActionArgs } from "../types/action-args"

// Changes the current working directory to the one given in the hyperlink or code block
export default function cd(args: ActionArgs) {
  const directory = args.nodes.text()
  args.name(`changing into the ${color.bold(color.cyan(directory))} directory`)
  const fullPath = path.join(args.configuration.workspace, directory)
  args.log(`cd ${fullPath}`)
  try {
    process.chdir(fullPath)
  } catch (e) {
    if (e.code === "ENOENT") {
      throw new Error(`directory ${directory} not found`)
    }
    throw e
  }
}
