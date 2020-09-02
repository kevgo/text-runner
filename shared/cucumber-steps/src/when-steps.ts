import { When } from "cucumber"
import * as textRunner from "text-runner"
import { executeCLI } from "./helpers/execute-cli"
import { TRWorld } from "./world"

When(/^(trying to run|running) "([^"]*)"$/, { timeout: 30_000 }, async function (tryingText, command) {
  const world = this as TRWorld
  world.process = await executeCLI(command, determineExpectError(tryingText), world)
})

When(/^(trying to run|running) Text-Runner$/, { timeout: 30_000 }, async function (tryingText) {
  const world = this as TRWorld
  world.process = await executeCLI("run", determineExpectError(tryingText), world)
})

When(/^(trying to call|calling) "([^"]+)"$/, async function (tryingText: string, jsText: string) {
  const world = this as TRWorld
  const expectError = determineExpectError(tryingText)
  // @ts-ignore: this make textRunner available as a variable here
  const tr = textRunner
  // @ts-ignore: this is used inside eval
  const sourceDir = world.rootDir
  // @ts-ignore: this is used inside eval
  const formatterName = "silent"
  let result: any
  let error: Error
  eval("result = " + jsText)
  try {
    world.apiResults = await result
  } catch (e) {
    world.apiException = e
    if (expectError) {
      // expected the error --> done here
      return
    } else {
      throw new Error(`Unexpected exception: ${e}`)
    }
  }
  if (!expectError && world.apiResults.errorCount === 0) {
    // no error expected, no error encountered --> done
    return
  }
  if (expectError && world.apiResults.errorCount > 0) {
    // error expected and error encountered --> done
    return
  }
  if (expectError && world.apiResults.errorCount === 0) {
    // error expected and no error encountered --> error
    throw new Error("expected error but got none")
  }
  // no error expected and error encountered
  console.log(`${world.apiResults.errorCount} errors`)
  for (const activityResult of world.apiResults.activityResults) {
    if (activityResult.error) {
      console.log(`- ${activityResult.error.name}: ${activityResult.error.message}`)
    }
  }
  throw new Error("unexpected error")
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
