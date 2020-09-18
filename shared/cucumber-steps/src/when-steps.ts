import { When } from "cucumber"
import { executeCLI } from "./helpers/execute-cli"
import { TRWorld } from "./world"
import * as textRunner from "text-runner-core"
import { ActivityCollector } from "./activity-collector"

When(/^calling:$/, async function (jsText: string) {
  const world = this as TRWorld
  const config: textRunner.PartialConfiguration = { sourceDir: world.rootDir }
  // define a few variables here, they will be overwritten in the eval call
  let command = new textRunner.RunCommand(config)
  let observer = new ActivityCollector(command)
  // eval the given code
  let asyncFunc = async function (tr: typeof textRunner, ac: typeof ActivityCollector) {}
  // NOTE: instantiating an AsyncFunction
  //       (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)
  //       directly would be more elegant here but somehow doesn't work on Node 14.
  const funcText = `
  asyncFunc = async function runner(textRunner, MyObserverClass) {
    ${jsText}
  }`
  eval(funcText)
  try {
    await asyncFunc(textRunner, ActivityCollector)
    world.apiResults = observer.results()
  } catch (e) {
    world.apiException = e
  }
})

When(/^calling Text-Runner$/, async function () {
  const world = this as TRWorld
  const command = new textRunner.RunCommand({ sourceDir: world.rootDir })
  const activityCollector = new ActivityCollector(command)
  try {
    await command.execute()
  } catch (e) {
    world.apiException = e
  }
  world.apiResults = activityCollector.results()
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
