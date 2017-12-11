const {red} = require('chalk')
const cliCursor = require('cli-cursor')
const endChildProcesses = require('end-child-processes')
const minimist = require('minimist')
const TextRunner = require('./text-runner')

cliCursor.hide()

const argv = minimist(process.argv.slice(2))
const commandsText = argv._
delete argv._
const commands = (commandsText[0] || '').split(' ')
                                        .filter(it => it !== 'text-run')
const textRunner = new TextRunner(argv)
textRunner.execute((commands[0] || 'run'), commands.slice(1), (err) => {
  if (err && err.message !== 1) console.log(red(err))

  endChildProcesses()
  if (err) {
    process.exit(1)
  } else {
    process.exit(0)
  }
})
