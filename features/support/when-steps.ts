import { When } from 'cucumber'
import ncp from 'ncp'
import path from 'path'
import util from 'util'

When(
  /^(trying to execute|executing) the "([^"]+)" example$/,
  { timeout: 100000 },
  async function(tryingText, exampleName) {
    const expectError = determineExpectError(tryingText)
    const ncpp = util.promisify(ncp)
    await ncpp(
      path.join('documentation', 'examples', exampleName),
      this.rootDir
    )
    await this.execute({ command: 'run', expectError })
    finish(
      expectError,
      this.process && (this.process.error || this.process.exitCode)
    )
  }
)

When(/^(trying to run|running) "([^"]*)"$/, async function(
  tryingText,
  command
) {
  const expectError = determineExpectError(tryingText)
  await this.execute({ command, cwd: this.rootDir, expectError })
  finish(expectError, this.process.error || this.process.exitCode)
})

When(/^(trying to run|running) text-run$/, async function(tryingText) {
  const expectError = determineExpectError(tryingText)
  try {
    await this.execute({ command: 'run', cwd: this.rootDir, expectError })
  } catch (err) {
    finish(expectError, err)
    return
  }
  finish(
    expectError,
    this.error || (this.process && this.process.exitCode !== 0)
  )
})

When(
  /^(trying to run|running) text-run with the arguments? "([^"]*)"$/,
  async function(tryingText, optionsText) {
    const expectError = determineExpectError(tryingText)
    const splitted = optionsText.split(' ')
    const command = splitted[0]
    const options = splitted.splice(1)
    await this.execute({ command, options, cwd: this.rootDir, expectError })
    finish(expectError, this.process.error || this.process.exitCode)
  }
)

When(
  /^(trying to run|running) text-run with the arguments? {([^}]*)}$/,
  async function(tryingText, argsText) {
    const expectError = determineExpectError(tryingText)
    const args = JSON.parse(`{${argsText}}`)
    args.command = 'run'
    args.cwd = this.rootDir
    args.expectError = expectError
    await this.execute(args)
    finish(
      expectError,
      this.error ||
        (this.process && (this.process.error || this.process.exitCode))
    )
  }
)

When(
  /^(trying to run|running) text-run with the "([^"]*)" formatter$/,
  async function(tryingText, formatterName) {
    const expectError = determineExpectError(tryingText)
    try {
      await this.execute({
        command: 'run',
        cwd: this.rootDir,
        options: { formatter: formatterName },
        expectError
      })
      finish(expectError, this.process.exitCode)
    } catch (err) {
      finish(expectError, err)
    }
  }
)

When(/^(trying to run|running) the "([^"]*)" command$/, async function(
  tryingText,
  command
) {
  const expectError = determineExpectError(tryingText)
  await this.execute({ command, cwd: this.rootDir, expectError })
  finish(
    expectError,
    this.error ||
      (this.process && (this.process.error || this.process.exitCode))
  )
})

function determineExpectError(tryingText) {
  if (tryingText === 'running') {
    return false
  } else if (tryingText === 'executing') {
    return false
  } else {
    return true
  }
}

function finish(trying, error) {
  if (trying && !error) {
    throw new Error('expected error but test succeeded')
  } else if (trying && error) {
    // nothing to do here, we expected the error
  } else if (error) {
    throw error
  }
}
