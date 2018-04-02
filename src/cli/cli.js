// @flow

const { red } = require('chalk')
const cliCursor = require('cli-cursor')
const { codeFrameColumns } = require('@babel/code-frame')
const endChildProcesses = require('end-child-processes')
const fs = require('fs')
const parseCliArgs = require('./parse-cli-args')
const textRunner = require('../text-runner')
const UnprintedUserError = require('../errors/unprinted-user-error.js')
const UserError = require('../errors/user-error.js')

cliCursor.hide()

async function main () {
  var exitCode = 0
  try {
    const cliArgs = parseCliArgs(process.argv)
    await textRunner(cliArgs)
  } catch (err) {
    exitCode = 1
    if (err instanceof UnprintedUserError) {
      console.log(red(err.message))
      if (err.filePath && err.line) {
        const fileContent = fs.readFileSync(err.filePath)
        console.log(
          codeFrameColumns(
            fileContent,
            { start: err.line },
            { forceColor: true }
          )
        )
      }
    } else if (!(err instanceof UserError)) {
      console.log(err.stack)
    }
  }
  endChildProcesses()
  process.exit(exitCode)
}

main()
