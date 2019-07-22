import fs from "fs-extra"
import path from "path"
import { isJsFile } from "../../../helpers/is-js-file"
import { TransformerList } from "./transformer-list"

/**
 * Loads the transformers in the local `transformers` directory
 * @param callerDir the directory in which the caller is
 */
export async function loadTransformers(
  callerDir: string
): Promise<TransformerList> {
  const result: TransformerList = {}
  const distDir = path.join(dirInDistFolder(callerDir), "transformers")
  const files = (await fs.readdir(distDir)).filter(isJsFile)
  for (const file of files) {
    const transformerPath = path.join(distDir, file)
    const transformer = require(transformerPath).default
    result[path.basename(file, ".js")] = transformer
  }
  return result
}

/** Returns the path of the given dir in the dist folder */
function dirInDistFolder(dir: string): string {
  return dir.replace("src", "dist")
}
