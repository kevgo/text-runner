import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-engine"
import * as url from "url"

/** files that we should not delete when cleaning up a workspace */
const filesToKeep = ["package.json", "tsconfig.json", "node_modules"]
/** the original contents of files before an end-to-end test ran in a workspace */
const fileBackups = {
  "package.json": ""
}
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
/** full path to the workspace */
const workspacePath = dirPath(process.cwd(), __dirname, process.env.CUCUMBER_WORKER_ID ?? "0")
export const absPath = new textRunner.files.AbsoluteDirPath(workspacePath)

/** stores the original content of a workspace for end-to-end tests in order to restore it later */
export async function backup() {
  for (const fileName in fileBackups) {
    const filePath = path.join(workspacePath, fileName)
    // @ts-expect-error TypeScript is too stupid to understand that "filePath" contains exactly the type signature ("package.json") that it wants here
    fileBackups[fileName] = await fs.readFile(filePath, "utf-8")
  }
}

/** provides the path of the workspace to use */
export function dirPath(cwd: string, dirname: string, cucumberWorkerId: string): string {
  let dir = path.basename(cwd)
  dir = dir.replace("text-runner-", "")
  dir = dir.replace("textrun-", "")
  if (dir === "features") {
    dir += `_${cucumberWorkerId}`
  }
  return path.join(dirname, "..", "..", "..", "..", "test", dir)
}

export async function restore() {
  const fileOps = []
  for (const fileName of await fs.readdir(workspacePath)) {
    if (!filesToKeep.includes(fileName)) {
      const filePath = path.join(workspacePath, fileName)
      fileOps.push(fs.rm(filePath, { recursive: true }))
    }
  }
  for (const [fileName, fileContent] of Object.entries(fileBackups)) {
    const filePath = path.join(workspacePath, fileName)
    fileOps.push(fs.writeFile(filePath, fileContent))
  }
  await Promise.all(fileOps)
}
