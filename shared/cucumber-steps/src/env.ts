import * as cucumber from "@cucumber/cucumber"
import { deleteAsync } from "del"
import { endChildProcesses } from "end-child-processes"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-core"
import * as tmp from "tmp-promise"

import { TRWorld } from "./world.js"

// eslint-disable-next-line @typescript-eslint/no-misused-promises
cucumber.Before(async function (this: TRWorld) {
  if (process.env.CUCUMBER_PARALLEL) {
    const tempDir = await tmp.dir()
    this.workspace = new textRunner.files.AbsoluteDirPath(tempDir.path)
  } else {
    this.workspace = new textRunner.files.AbsoluteDirPath(path.join(process.cwd(), "tmp"))
  }
  let workspaceExists = false
  try {
    await fs.stat(this.workspace.platformified())
    workspaceExists = true
  } catch (e) {
    // nothing to do here
  }
  if (workspaceExists) {
    await fs.rmdir(this.workspace.platformified(), { recursive: true })
  }
  await fs.mkdir(this.workspace.platformified(), { recursive: true })
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
cucumber.After({ timeout: 20_000 }, async function (this: TRWorld, scenario) {
  await endChildProcesses()
  if (scenario.result?.status === cucumber.Status.FAILED) {
    console.log("\ntest artifacts are located in", this.workspace.platformified())
  } else {
    // NOTE: need rimraf here because Windows requires to retry this for a few times
    // TODO: replace with fs
    await deleteAsync(this.workspace.platformified(), { force: true })
  }
})

cucumber.Before({ tags: "@debug" }, function (this: TRWorld) {
  this.debug = true
})

cucumber.After({ tags: "@debug" }, function (this: TRWorld) {
  this.debug = false
})
