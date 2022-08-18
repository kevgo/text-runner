import * as cucumber from "@cucumber/cucumber"
import { endChildProcesses } from "end-child-processes"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-core"
import * as url from "url"

import { TRWorld } from "./world.js"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
/** files that we should not delete when cleaning up a workspace */
const filesToKeep = ["package.json", "tsconfig.json", "node_modules", "Makefile"]
/** the original contents of files before an end-to-end test ran in a workspace */
const fileBackups = {
  "package.json": "",
  Makefile: "",
}

cucumber.BeforeAll(async function () {
  const workspace = determineWorkspace(process.cwd())
  for (const fileName in fileBackups) {
    const filePath = path.join(workspace, fileName)
    // @ts-expect-error TypeScript is too stupid to understand that "filePath" contains exactly the type signature ("package.json" | "Makefile") that it wants here
    fileBackups[fileName] = await fs.readFile(filePath, "utf-8")
  }
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
cucumber.Before(function (this: TRWorld) {
  const workspacePath = determineWorkspace(process.cwd())
  this.workspace = new textRunner.files.AbsoluteDirPath(workspacePath)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
cucumber.After({ timeout: 20_000 }, async function (this: TRWorld) {
  await endChildProcesses()
  const workspacePath = determineWorkspace(process.cwd())
  await resetWorkspace(workspacePath)
})

cucumber.Before({ tags: "@debug" }, function (this: TRWorld) {
  this.debug = true
})

cucumber.After({ tags: "@debug" }, function (this: TRWorld) {
  this.debug = false
})

async function resetWorkspace(workspacePath: string) {
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

function determineWorkspace(cwd: string): string {
  let dir = path.basename(cwd)
  dir = dir.replace("text-runner-", "")
  dir = dir.replace("textrun-", "")
  if (dir === "features") {
    dir += `_${process.env.CUCUMBER_WORKER_ID ?? 0}`
  }
  return path.join(__dirname, "..", "..", "..", "test", dir)
}
