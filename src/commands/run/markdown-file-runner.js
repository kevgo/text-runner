// @flow

const ActionManager = require('../../actions/action-manager.js')
const ActivityListBuilder = require('./activity-list-builder')
const async = require('async')
const {cyan} = require('chalk')
const fs = require('fs')
const LinkTargetBuilder = require('./link-target-builder')
const MarkdownParser = require('./markdown-parser')
const path = require('path')
const {wait} = require('wait')

// Runs the given Markdown file
class MarkdownFileRunner {
  filePath: string
  formatter: Formatter
  actions: ActionManager
  configuration: Configuration
  parser: MarkdownParser
  activityListBuilder: ActivityListBuilder
  linkTargetBuilder: LinkTargetBuilder
  runData: ActivityList

  constructor (value: {filePath: string, formatter: Formatter, actions: ActionManager, configuration: Configuration, linkTargets: LinkTargetList}) {
    this.filePath = value.filePath
    this.formatter = value.formatter
    this.configuration = value.configuration
    this.parser = new MarkdownParser()
    this.activityListBuilder = new ActivityListBuilder({
      actions: value.actions,
      filePath: this.filePath,
      formatter: this.formatter,
      configuration: this.configuration,
      linkTargets: value.linkTargets})
    this.linkTargetBuilder = new LinkTargetBuilder({linkTargets: value.linkTargets})
  }

  // Prepares this runner
  prepare (done: DoneFunction) {
    // Need to start the file here
    // so that the formatter has the filename
    // in case there are errors preparing.
    fs.readFile(this.filePath, {encoding: 'utf8'}, (err: ?ErrnoError, markdownText: string) => {
      if (err) return done(err)
      try {
        markdownText = markdownText.trim()
        if (markdownText.length === 0) {
          this.formatter.startFile(this.filePath)
          this.formatter.error(`found empty file ${cyan(path.relative(process.cwd(), this.filePath))}`)
          return done(new Error(1))
        }
        const astNodeList = this.parser.parse(markdownText)
        const linkTargets = this.linkTargetBuilder.buildLinkTargets(this.filePath, astNodeList)
        this.runData = this.activityListBuilder.build(linkTargets)
        done()
      } catch (e) {
        if (e.message !== '1') console.log(e)
        done(e)
      }
    })
  }

  // Runs this runner
  // (after it has been prepared)
  run (done: (err: ?ErrnoError, count: number) => void) {
    async.mapSeries(this.runData, this._runBlock, (err) => {
      done(err, this.runData.length)
    })
  }

  _runBlock (block, done) {
    // waiting 1 ms here to give Node a chance to run queued up logic from previous steps
    wait(1, () => {
      try {
        block.formatter.startFile(block.filename)
        block.formatter.setLines(block.startLine, block.endLine)
        if (block.runner.length === 1) {
          // synchronous action method or returns a promise
          const outcome = block.runner(block)
          Promise.resolve(outcome).then(done).catch(function (err) {
            throw err
          })
        } else {
          // asynchronous action method
          block.runner(block, done)
        }
      } catch (e) {
        block.formatter.error(e)
        done(e)
      }
    })
  }
}

module.exports = MarkdownFileRunner
