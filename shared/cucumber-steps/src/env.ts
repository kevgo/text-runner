import * as cucumber from "@cucumber/cucumber"
import { endChildProcesses } from "end-child-processes"

import * as workspace from "./helpers/workspace.js"
import { TRWorld } from "./world.js"

cucumber.BeforeAll(async function () {
  await workspace.backup()
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
cucumber.After({ timeout: 20_000 }, async function (this: TRWorld) {
  await endChildProcesses()
  await workspace.restore()
})

cucumber.Before({ tags: "@debug" }, function (this: TRWorld) {
  this.debug = true
})

cucumber.After({ tags: "@debug" }, function (this: TRWorld) {
  this.debug = false
})
