// @flow

const ActionManager = require('../../actions/action-manager.js')
const async = require('async')
const fs = require('fs')
const glob = require('glob')
const MarkdownFileRunner = require('./markdown-file-runner')
const mkdirp = require('mkdirp')
const path = require('path')
const {head, filter, reject, sort, sum} = require('prelude-ls')
const rimraf = require('rimraf')
const tmp = require('tmp')
const debug = require('debug')('text-runner:run-command')

class RunCommand implements Command {
  configuration: Configuration
  formatter: Formatter
  actions: ActionManager
  linkTargets: LinkTargetList     // lists which files contain which HTML anchors
  runners: MarkdownFileRunner[]

  constructor (value: {configuration: Configuration, formatter: Formatter, actions: ActionManager}) {
    this.configuration = value.configuration
    this.formatter = value.formatter
    this.actions = value.actions
    this.linkTargets = {}
  }

  // Tests all files
  run (done: DoneFunction) {
    this._run(this._allMarkdownFiles(), done)
  }

  // Tests all files in the given directory
  runDirectory (dirname: string, done: DoneFunction) {
    this._run(this._markdownFilesInDir(dirname), done)
  }

  // Tests the given file
  runFile (filename: string, done: DoneFunction) {
    this._run([filename], done)
  }

  // Tests the files described by the given glob expression
  runGlob (fileExpression: string, done: DoneFunction) {
    const files = this._filesMatchingGlob(fileExpression)
    if (files != null) {
      this._run(files, done)
    } else {
      done()
    }
  }

  // Runs the currently set up runners.
  _run (filenames: string[], done: DoneFunction) {
    debug('testing files:')
    for (let filename of filenames) {
      debug(`  * ${filename}`)
    }
    try {
      this._createWorkingDir()
      this._createRunners(filenames)
      this._prepareRunners((err: Error) => {
        if (err) return done(err)
        this._executeRunners(done)
      })
    } catch (e) {
      console.log(e)
      throw (e)
    }
  }

  _createRunners (filenames: string[]) {
    this.runners = []
    for (let filePath of filenames) {
      const runner = new MarkdownFileRunner({
        filePath,
        formatter: this.formatter,
        actions: this.actions,
        configuration: this.configuration,
        linkTargets: this.linkTargets})
      this.runners.push(runner)
    }
  }

  // Creates the temp directory to run the tests in
  _createWorkingDir () {
    const setting = this.configuration.get('useTempDirectory')
    if (typeof setting === 'string') {
      this.configuration.testDir = setting
    } else if (setting === false) {
      this.configuration.testDir = path.join(process.cwd(), 'tmp')
    } else if (setting === true) {
      this.configuration.testDir = tmp.dirSync().name
    } else {
      throw new Error(`unknown 'useTempDirectory' setting: ${setting}`)
    }
    try {
      debug(`using test directory: ${this.configuration.testDir}`)
      mkdirp.sync(this.configuration.testDir)
    } catch (e) {
      // TODO: ignore error here?
    }
  }

  _filesMatchingGlob (expression: string): string[] {
    return sort(glob.sync(expression))
  }

  // Returns all the markdown files in this directory and its children
  _markdownFilesInDir (dirName) {
    const files = glob.sync(`${dirName}/**/*.md`)
    if (files.length === 0) {
      this.formatter.warning('no Markdown files found')
    }
    return files.filter(file => !file.includes('node_modules'))
                .sort()
  }

  // Returns all the markdown files in the current working directory
  _allMarkdownFiles () {
    var files = glob.sync(this.configuration.get('files'))
    if (files.length === 0) {
      this.formatter.warning('no Markdown files found')
    }
    files = files.filter(file => !file.includes('node_modules'))
                 .sort()
    // if (this.filename != null) {
    //   files = files.filter(file => !file === this.filename)
    // }
    return files
  }

  _executeRunner (runner, done) {
    try {
      runner.run(done)
    } catch (e) {
      console.log(e)
      done(e)
    }
  }

  _executeRunners (done) {
    async.mapSeries(this.runners, this._executeRunner, (err, results) => {
      if (err) return done(err)
      const stepsCount = sum(results)
      if (stepsCount === 0) {
        this.formatter.warning('no activities found')
        done()
      } else {
        this.formatter.suiteSuccess(stepsCount)
        done()
      }
    })
  }

  _prepareRunner (runner, done) {
    runner.prepare(done)
  }

  _prepareRunners (done) {
    async.each(this.runners, this._prepareRunner, done)
  }
}

module.exports = RunCommand
