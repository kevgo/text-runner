// @flow

const ActionManager = require('../../actions/action-manager.js')
const glob = require('glob')
const MarkdownFileRunner = require('./markdown-file-runner')
const mkdirp = require('mkdirp')
const path = require('path')
const tmp = require('tmp')
const debug = require('debug')('text-runner:run-command')
const UnprintedUserError = require('../../errors/unprinted-user-error.js')

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
  async run () {
    await this._run(this._allMarkdownFiles())
  }

  // Tests all files in the given directory
  async runDirectory (dirname: string) {
    await this._run(this._markdownFilesInDir(dirname))
  }

  // Tests the given file
  async runFile (filename: string) {
    await this._run([filename])
  }

  // Tests the files described by the given glob expression
  async runGlob (fileExpression: string) {
    const files = this._filesMatchingGlob(fileExpression)
    if (files != null) {
      await this._run(files)
    }
  }

  // Runs the currently set up runners.
  async _run (filenames: string[]) {
    debug('testing files:')
    for (let filename of filenames) {
      debug(`  * ${filename}`)
    }
    this._createWorkingDir()
    this._createRunners(filenames)
    await this._prepareRunners()
    await this._executeRunners()
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
      throw new UnprintedUserError(`unknown 'useTempDirectory' setting: ${setting}`)
    }
    try {
      debug(`using test directory: ${this.configuration.testDir}`)
      mkdirp.sync(this.configuration.testDir)
    } catch (e) {
      // TODO: ignore error here?
    }
  }

  _filesMatchingGlob (expression: string): string[] {
    return glob.sync(expression).sort()
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

  async _executeRunner (runner): Promise<number> {
    const result = await runner.run()
    return result
  }

  async _executeRunners (): Promise<void> {
    var stepsCount = 0
    for (let runner of this.runners) {
      stepsCount += await this._executeRunner(runner)
    }
    if (stepsCount === 0) {
      this.formatter.warning('no activities found')
    } else {
      this.formatter.suiteSuccess(stepsCount)
    }
  }

  async _prepareRunners () {
    for (let runner of this.runners) {
      await runner.prepare()
    }
  }
}

module.exports = RunCommand
