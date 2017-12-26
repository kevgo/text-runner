// @flow

const callArgs = require('../../helpers/call-args')
const {bold, cyan} = require('chalk')
const ObservableProcess = require('observable-process')
const path = require('path')
const {compact, head, map, tail} = require('prelude-ls')
const trimDollar = require('../../helpers/trim-dollar')
const debug = require('debug')('start-console-command')

// Runs the given commands on the console.
// Leaves the command running.
module.exports = function (args: {configuration: Configuration, formatter: Formatter, searcher: Searcher}, done: DoneFunction) {
  args.formatter.start('starting a long-running process')

  const commandsToRun = args.searcher.nodeContent({type: 'fence'}, ({content, nodes}) => {
    if (nodes.length === 0) return 'no code blocks found'
    if (nodes.length > 2) return 'found #{nodes.length} fenced code blocks. Expecting a maximum of 2.'
    if (!content) return 'the block that defines console commands to run is empty'
  }).split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .map(trimDollar)
    .map(makeGlobal(args.configuration))
    .join(' && ')

  args.formatter.refine(`starting a long-running process: ${bold(cyan(commandsToRun))}`)
  global.startConsoleCommandOutput = ''
  global.runningProcess = new ObservableProcess(callArgs(commandsToRun), {
    cwd: args.configuration.testDir,
    stdout: log(args.formatter.stdout),
    stderr: args.formatter.stderr})
  global.runningProcess.on('ended', (err) => {
    global.runningProcessEnded = true
    global.runningProcessError = err
  })

  args.formatter.success()
  done()
}

function log (stdout) {
  return {
    write: (text) => {
      global.startConsoleCommandOutput += text
      stdout.write(text)
    }
  }
}

function makeGlobal (configuration: Configuration) {
  configuration = configuration || {}
  var globals = {}
  try {
    globals = configuration.fileData.actions.runConsoleCommand.globals
  } catch (e) {} // Ignore null-pointer exceptions here since we have a default value
  debug(`globals: ${JSON.stringify(globals)}`)
  return function (commandText) {
    const commandParts = commandText.split(' ')
    const command = head(commandParts)
    debug(`searching for global replacement for ${command}`)
    const replacement = globals[command]
    if (replacement) {
      debug(`found replacement: ${replacement}`)
      return path.join(configuration.sourceDir, replacement) + ' ' + tail(commandParts).join(' ')
    } else {
      return commandText
    }
  }
}
