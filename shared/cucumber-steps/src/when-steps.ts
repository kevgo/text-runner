import { When } from "cucumber"
import { executeCLI } from "./helpers/execute-cli"
import { TRWorld } from "./world"
import { callTextRunner } from "./helpers/call-text-runner"
import { BlackholeFormatter } from "./blackhole-formatter"
import * as textRunner from "text-runner"

When(/^(trying to call|calling) "([^"]+)"$/, async function (tryingText: string, jsText: string) {
  const world = this as TRWorld
  const expectError = determineExpectError(tryingText)
  try {
    world.activityResults = await callTextRunner(jsText, world.rootDir, expectError)
  } catch (e) {
    world.apiException = e
    if (expectError) {
      // expected the error --> done here
      return
    } else {
      throw new Error(`Unexpected exception: ${e}`)
    }
  }
})

When(/^(trying to call|calling) Text-Runner$/, async function (tryingText: string) {
  const world = this as TRWorld
  const expectError = determineExpectError(tryingText)
  const config = textRunner.defaultConfiguration()
  config.sourceDir = this.rootDir
  const runCommand = new textRunner.RunCommand(config)
  const formatter = new BlackholeFormatter(runCommand)
  await runCommand.execute()
  world.activityResults = formatter.activityResults
  await callTextRunner("textRunner.runCommand({sourceDir, formatterName})", world.rootDir, expectError)
})

When(/^(trying to run|running) "([^"]*)"$/, { timeout: 30_000 }, async function (tryingText, command) {
  const world = this as TRWorld
  world.process = await executeCLI(command, determineExpectError(tryingText), world)
})

When(/^(trying to run|running) Text-Runner$/, { timeout: 30_000 }, async function (tryingText) {
  const world = this as TRWorld
  world.process = await executeCLI("run", determineExpectError(tryingText), world)
})

When(/^(trying to run|running) Text-Runner in the source directory$/, { timeout: 30_000 }, async function (tryingText) {
  const world = this as TRWorld
  world.process = await executeCLI("run", determineExpectError(tryingText), world, { cwd: world.rootDir })
})

function determineExpectError(tryingText: string) {
  if (tryingText === "running") {
    return false
  } else if (tryingText === "executing") {
    return false
  } else if (tryingText === "calling") {
    return false
  } else {
    return true
  }
}

function finish(trying: boolean, exitCode: number | Error) {
  if (trying && !exitCode) {
    throw new Error("expected error but test succeeded")
  } else if (trying && exitCode) {
    // nothing to do here, we expected the error
  } else if (exitCode) {
    if (typeof exitCode === "number") {
      throw new Error(`Expected success but got exit code: ${exitCode}`)
    } else {
      throw new Error(`Expected success but got error: ${exitCode}`)
    }
  }
}
