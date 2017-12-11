const {red} = require('chalk')
const cliCursor = require('cli-cursor')
const endChildProcesses = require('end-child-processes')
const minimist = require('minimist')
const {tail} = require('prelude-ls')
const TextRunner = require('./text-runner')

cliCursor.hide()

const argv = minimist(process.argv.slice(2))
const commandsText = delete (argv._)
const commands = (commandsText[0] || '').split(' ')
                                        .filter(it => it !== 'text-run')
const textRunner = new TextRunner(argv)
textRunner.execute((commands[0] || 'run'), tail(commands), (err) => {
  if (err && err.message !== 1) console.log(red(err))

  endChildProcesses()
  if (err) {
    process.exit(1)
  } else {
    process.exit(0)
  }
})
