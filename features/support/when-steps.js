// @flow

const ncp = require('ncp')
const N = require('nitroglycerin')

module.exports = function () {
  this.When(/^(trying to execute|executing) the "([^"]+)" example$/, {timeout: 100000}, function (tryingText, exampleName, done) {
    const expectError = determineExpectError(tryingText)
    ncp(`examples/${exampleName}`, this.rootDir.name, N(() => {
      this.execute({command: 'run', expectError}, () => {
        finish(expectError, (this.error || this.exitCode), done)
      })
    }))
  })

  this.When(/^(trying to run|running) "([^"]*)"$/, function (tryingText, command, done) {
    const expectError = determineExpectError(tryingText)
    this.execute({command, cwd: this.rootDir.name, expectError}, () => {
      finish(expectError, (this.error || this.exitCode), done)
    })
  })

  this.When(/^(trying to run|running) text\-run$/, function (tryingText, done) {
    const expectError = determineExpectError(tryingText)
    this.execute({command: 'run', cwd: this.rootDir.name, expectError}, () => {
      finish(expectError, (this.error || this.exitCode), done)
    })
  })

  this.When(/^(trying to run|running) text\-run with the arguments? "([^"]*)"$/, function (tryingText, optionsText, done) {
    const expectError = determineExpectError(tryingText)
    const splitted = optionsText.split(' ')
    const command = splitted[0]
    const options = splitted.splice(1)
    this.execute({command, options, cwd: this.rootDir.name, expectError}, () => {
      finish(expectError, (this.error || this.exitCode), done)
    })
  })

  this.When(/^(trying to run|running) text\-run with the arguments? {([^}]*)}$/, function (tryingText, argsText, done) {
    const expectError = determineExpectError(tryingText)
    const args = JSON.parse(`{${argsText}}`)
    args.command = 'run'
    args.cwd = this.rootDir.name
    args.expectError = expectError
    this.execute(args, () => {
      finish(expectError, (this.error || this.exitCode), done)
    })
  })

  this.When(/^(trying to run|running) text\-run with the "([^"]*)" formatter$/, function (tryingText, formatterName, done) {
    const expectError = determineExpectError(tryingText)
    this.execute({command: 'run', cwd: this.rootDir.name, options: {formatter: formatterName}, expectError}, () => {
      finish(expectError, (this.error || this.exitCode), done)
    })
  })

  this.When(/^(trying to run|running) the "([^"]*)" command$/, function (tryingText, command, done) {
    const expectError = determineExpectError(tryingText)
    this.execute({command, cwd: this.rootDir.name, expectError}, () => {
      finish(expectError, (this.error || this.exitCode), done)
    })
  })
}

function determineExpectError (tryingText) {
  if (tryingText === 'running') {
    return false
  } else if (tryingText === 'executing') {
    return false
  } else {
    return true
  }
}

function finish (trying, error, done) {
  if (trying) {
    done(!error)
  } else {
    done(error)
  }
}
