// @flow

const callArgs = require('../../helpers/call-args')
const {cyan, red} = require('chalk')
const ObservableProcess = require('observable-process')
const path = require('path')
const {compact, find, head, map, tail, values} = require('prelude-ls')
const trimDollar = require('../../helpers/trim-dollar')
const xml2js = require('xml2js')
const debug = require('debug')('textrun:actions:run-console-command')

type ProcessInput = {
  textToWait: ?string,
  input: string
}

type ProcessInputList = Array<ProcessInput>

// Runs the given commands on the console.
// Waits until the command is finished.
module.exports = function (params: {configuration: Configuration, formatter: Formatter, searcher: Searcher}, done: DoneFunction) {
  params.formatter.start('running console command')

  const commandsToRun = params.searcher.nodeContent({type: 'fence'}, ({content, nodes}) => {
    if (nodes.length === 0) return 'no code blocks found'
    if (nodes.length > 1) return 'found #{nodes.length} fenced code blocks. Expecting only one.'
    if (!content) return 'the block that defines console commands to run is empty'
  }).split('\n')
    .map((command) => command.trim())
    .filter((e) => e)
    .map(trimDollar)
    .map(makeGlobal(params.configuration))
    .join(' && ')

  const inputText = params.searcher.nodeContent({type: 'htmlblock'})
  getInput(inputText, params.formatter, (input) => {
    params.formatter.refine(`running console command: ${cyan(commandsToRun)}`)
    global.runConsoleCommandOutput = ''
    const processor = new ObservableProcess(callArgs(commandsToRun), {
      cwd: params.configuration.testDir,
      stdout: log(params.formatter.stdout),
      stderr: params.formatter.stderr})
    processor.on('ended', (err) => {
      if (err) {
        params.formatter.error(err)
      } else {
        params.formatter.success()
      }
      done(err)
    })

    for (let inputLine of input) {
      enter(processor, inputLine)
    }
  })
}

function enter (processor: ObservableProcess, input: ProcessInput) {
  if (input.textToWait == null) {
    processor.enter(input.input)
  } else {
    processor.wait(input.textToWait, function () {
      processor.enter(input.input)
    })
  }
}

function getInput (text: string, formatter: Formatter, done: (input: ProcessInputList) => void) {
  if (!text) {
    done([])
    return
  }
  xml2js.parseString(text, (err, xml) => {
    if (err) {
      formatter.error(err)
      return
    }
    var result = []
    for (let tr of xml.table.tr) {
      if (tr.td) {
        if (tr.td.length === 1) {
          result.push({ textToWait: null, input: tr.td[0]})
        } else {
          result.push({textToWait: tr.td[0], input: tr.td[tr.td.length - 1]})
        }
      }
    }
    done(result)
  })
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

function log (stdout) {
  return {
    write: (text) => {
      global.runConsoleCommandOutput += text
      stdout.write(text)
    }
  }
}
