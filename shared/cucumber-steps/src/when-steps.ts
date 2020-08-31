import { When } from "cucumber"
import * as textRunner from "text-runner"

When(/^(trying to run|running) "([^"]*)"$/, { timeout: 30_000 }, async function (tryingText, command) {
  const expectError = determineExpectError(tryingText)
  await this.executeCLI({ command, expectError })
  finish(expectError, this.process.exitCode)
})

When(/^(trying to run|running) text-run$/, { timeout: 30_000 }, async function (tryingText) {
  const expectError = determineExpectError(tryingText)
  try {
    await this.executeCLI({ command: "run", expectError })
  } catch (err) {
    finish(expectError, err)
    return
  }
  finish(expectError, this.process.exitCode)
})

When(/^(trying to call|calling) "([^"]+)"$/, async function (tryingText: string, jsText: string) {
  const expectError = determineExpectError(tryingText)
  // @ts-ignore: this make textRunner available as a variable here
  const tr = textRunner
  // @ts-ignore: this is used inside eval
  const sourceDir = this.rootDir
  // @ts-ignore: this is used inside eval
  const formatterName = "silent"
  let result: any
  let error: Error
  eval("result = " + jsText)
  try {
    this.apiResults = await result
  } catch (e) {
    this.apiException = e
    if (expectError) {
      // expected the error --> done here
      return
    } else {
      throw new Error(`Unexpected exception: ${e}`)
    }
  }
  const apiResults = this.apiResults as textRunner.ExecuteResult
  if (!expectError && apiResults.errorCount === 0) {
    // no error expected, no error encountered --> done
    return
  }
  if (expectError && apiResults.errorCount > 0) {
    // error expected and error encountered --> done
    return
  }
  if (expectError && apiResults.errorCount === 0) {
    // error expected and no error encountered --> error
    throw new Error("expected error but got none")
  }
  // no error expected and error encountered
  console.log(`${apiResults.errorCount} errors`)
  for (const activityResult of apiResults.activityResults) {
    if (activityResult.error) {
      console.log(`- ${activityResult.error.name}: ${activityResult.error.message}`)
    }
  }
  throw new Error("unexpected error")
})

When(/^(trying to run|running) text-run in the source directory$/, { timeout: 30_000 }, async function (tryingText) {
  const expectError = determineExpectError(tryingText)
  try {
    await this.executeCLI({ command: "run", cwd: this.rootDir, expectError })
  } catch (err) {
    finish(expectError, err)
    return
  }
  finish(expectError, this.error || (this.process && this.process.exitCode !== 0))
})

When(/^(trying to run|running) text-run with the arguments? "([^"]*)"$/, { timeout: 30_000 }, async function (
  tryingText,
  optionsText
) {
  const expectError = determineExpectError(tryingText)
  const splitted = optionsText.split(" ")
  const command = splitted[0]
  const options = splitted.splice(1)
  await this.executeCLI({ command, options, expectError })
  finish(expectError, this.process.error || this.process.exitCode)
})

When(/^(trying to run|running) text-run with the arguments? {([^}]*)}$/, { timeout: 30_000 }, async function (
  tryingText,
  argsText
) {
  const expectError = determineExpectError(tryingText)
  const args = JSON.parse(`{${argsText}}`)
  args.command = "run"
  args.expectError = expectError
  await this.executeCLI(args)
  finish(expectError, this.error || (this.process && (this.process.error || this.process.exitCode)))
})

When(/^(trying to run|running) text-run with the "([^"]*)" formatter$/, { timeout: 30_000 }, async function (
  tryingText,
  formatterName
) {
  const expectError = determineExpectError(tryingText)
  try {
    await this.executeCLI({
      command: "run",
      expectError,
      options: { formatter: formatterName },
    })
    finish(expectError, this.process.exitCode)
  } catch (err) {
    finish(expectError, err)
  }
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

function finish(trying: boolean, exitCode: number) {
  if (trying && exitCode === 0) {
    throw new Error("expected error but test succeeded")
  } else if (trying && exitCode > 0) {
    // nothing to do here, we expected the error
  } else if (exitCode > 0) {
    throw new Error(`unexpected exit code: ${exitCode}`)
  }
}
