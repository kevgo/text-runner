import { When } from "@cucumber/cucumber"
import * as textRunner from "text-runner-core"

import * as helpers from "./helpers/index.js"
import * as workspace from "./helpers/workspace.js"
import { TRWorld } from "./world.js"

When(/^calling:$/, { timeout: 20_000 }, async function (this: TRWorld, jsText: string) {
  const config: textRunner.configuration.APIData = { sourceDir: workspace.absPath.platformified() }
  // define a few variables here, they will be overwritten in the eval call
  // eslint-disable-next-line prefer-const
  let command = new textRunner.commands.Run(config)
  // eslint-disable-next-line prefer-const
  let observer = new textRunner.ActivityCollector(command)
  // eval the given code
  // @ts-expect-error
  // eslint-disable-next-line prefer-const,no-empty-function
  let asyncFunc = async function (tr: typeof textRunner, ac: typeof ActivityCollector) { }
  // NOTE: instantiating an AsyncFunction
  //       (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)
  //       directly would be more elegant here but somehow doesn't work on Node 14.
  const funcText = `
  asyncFunc = async function runner(textRunner, MyObserverClass) {
    ${jsText}
  }`
  eval(funcText)
  try {
    await asyncFunc(textRunner, textRunner.ActivityCollector)
    this.apiResults = observer.results()
  } catch (e) {
    if (textRunner.isUserError(e)) {
      this.apiException = e
    } else {
      throw e
    }
  }
})

When(/^calling Text-Runner$/, { timeout: 20_000 }, async function (this: TRWorld) {
  const command = new textRunner.commands.Run({ sourceDir: workspace.absPath.platformified() })
  const activityCollector = new textRunner.ActivityCollector(command)
  try {
    await command.execute()
  } catch (e) {
    if (textRunner.isUserError(e)) {
      this.apiException = e
    } else {
      throw e
    }
  }
  this.apiResults = activityCollector.results()
})

When(
  /^(trying to run|running) "([^"]*)"$/,
  { timeout: 30_000 },
  async function (this: TRWorld, tryingText: string, command: string) {
    this.finishedProcess = await helpers.executeCLI(command, determineExpectError(tryingText), this)
  }
)

When(/^(trying to run|running) Text-Runner$/, { timeout: 30_000 }, async function (this: TRWorld, tryingText: string) {
  this.finishedProcess = await helpers.executeCLI("run", determineExpectError(tryingText), this)
})

When(
  /^(trying to run|running) Text-Runner in the source directory$/,
  { timeout: 30_000 },
  async function (this: TRWorld, tryingText: string) {
    this.finishedProcess = await helpers.executeCLI("run", determineExpectError(tryingText), this, {
      cwd: workspace.absPath.platformified(),
    })
  }
)

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
