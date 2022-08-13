import * as cucumber from "@cucumber/cucumber"
import * as child_process from "child_process"
import { endChildProcesses } from "end-child-processes"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-core"
import * as url from "url"

import { TRWorld } from "./world.js"

const filesToKeep = ["package.json", "tsconfig.json", "node_modules", "Makefile"]
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

// eslint-disable-next-line @typescript-eslint/no-misused-promises
cucumber.Before(async function (this: TRWorld) {
  const workerId = process.env.CUCUMBER_WORKER_ID ?? 0
  const workspacePath = path.join(__dirname, "..", "..", "..", "test", `workspace_${workerId}`)
  this.workspace = new textRunner.files.AbsoluteDirPath(workspacePath)
  await resetWorkspace(workspacePath)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
cucumber.After({ timeout: 20_000 }, async function (this: TRWorld, scenario) {
  await endChildProcesses()
  if (scenario.result?.status === cucumber.Status.FAILED) {
    console.log("\ntest artifacts are located in", this.workspace.platformified())
  } else {
    await resetWorkspace(this.workspace.platformified())
  }
})

cucumber.Before({ tags: "@debug" }, function (this: TRWorld) {
  this.debug = true
})

cucumber.After({ tags: "@debug" }, function (this: TRWorld) {
  this.debug = false
})

async function resetWorkspace(workspacePath: string) {
  const deletes = []
  for (const fileName of await fs.readdir(workspacePath)) {
    if (!filesToKeep.includes(fileName)) {
      const filePath = path.join(workspacePath, fileName)
      deletes.push(fs.rm(filePath, { recursive: true }))
    }
  }
  child_process.execSync("git restore .", { cwd: workspacePath })
  await Promise.all(deletes)
}
