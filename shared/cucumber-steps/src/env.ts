import { After, Before } from "cucumber"
import { endChildProcesses } from "end-child-processes"
import { promises as fs } from "fs"
import * as path from "path"
import * as rimraf from "rimraf"
import * as tmp from "tmp-promise"
import * as util from "util"

import { TRWorld } from "./world"
const rimrafp = util.promisify(rimraf)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
Before(async function () {
  const world = this as TRWorld
  if (process.env.CUCUMBER_PARALLEL) {
    const tempDir = await tmp.dir()
    world.rootDir = tempDir.path
  } else {
    world.rootDir = path.join(process.cwd(), "tmp")
  }
  let rootDirExists = false
  try {
    await fs.stat(world.rootDir)
    rootDirExists = true
  } catch (e) {
    // nothing to do here
  }
  if (rootDirExists) {
    await fs.rmdir(world.rootDir, { recursive: true })
  }
  await fs.mkdir(world.rootDir, { recursive: true })
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
After({ timeout: 20_000 }, async function (scenario) {
  const world = this as TRWorld
  await endChildProcesses()
  if (scenario.result.status === "failed") {
    console.log("\ntest artifacts are located in", world.rootDir)
  } else {
    // NOTE: need rimraf here because Windows requires to retry this for a few times
    // TODO: replace with fs
    await rimrafp(world.rootDir)
  }
})

Before({ tags: "@debug" }, function () {
  const world = this as TRWorld
  world.debug = true
})

After({ tags: "@debug" }, function () {
  const world = this as TRWorld
  world.debug = false
})
