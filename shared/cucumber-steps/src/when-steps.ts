import { When } from "cucumber"

When(/^(trying to run|running) "([^"]*)"$/, { timeout: 30_000 }, async function (tryingText, command) {
  const expectError = determineExpectError(tryingText)
  await this.executeCLI({ command, expectError })
  finish(expectError, this.process.error || this.process.exitCode)
})

When(/^(trying to run|running) text-run$/, { timeout: 30_000 }, async function (tryingText) {
  const expectError = determineExpectError(tryingText)
  try {
    await this.executeCLI({ command: "run", expectError })
  } catch (err) {
    finish(expectError, err)
    return
  }
  finish(expectError, this.error || (this.process && this.process.exitCode !== 0))
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
  } else {
    return true
  }
}

function finish(trying: boolean, error: Error) {
  if (trying && !error) {
    throw new Error("expected error but test succeeded")
  } else if (trying && error) {
    // nothing to do here, we expected the error
  } else if (error) {
    throw error
  }
}
