import { When } from "cucumber"
import { executeCLI } from "./helpers/execute-cli"
import { TRWorld } from "./world"
import { BlackholeFormatter } from "./blackhole-formatter"
import * as textRunner from "text-runner"

When(/^calling:$/, async function (jsText: string) {
  const world = this as TRWorld
  const sourceDir = world.rootDir
  const config = textRunner.defaultConfiguration({ sourceDir })
  let asyncFunc = async function (tr: typeof textRunner, f: typeof BlackholeFormatter, world: TRWorld) {}
  // NOTE: instantiating an AsyncFunction
  //       (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)
  //       would be more elegant here but somehow doesn't work on Node 14.
  const funcText = `
  asyncFunc = async function runner(textRunner, Formatter, world) {
    ${jsText}
  }`
  eval(funcText)
  try {
    await asyncFunc(textRunner, BlackholeFormatter, world)
  } catch (e) {
    world.apiException = e
  }
})

When(/^calling Text-Runner$/, async function () {
  const world = this as TRWorld
  const config = textRunner.defaultConfiguration({ sourceDir: world.rootDir })
  const command = new textRunner.RunCommand(config)
  const formatter = new BlackholeFormatter(command)
  try {
    await command.execute()
  } catch (e) {
    world.apiException = e
  }
  world.activityResults = formatter.activityResults
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
