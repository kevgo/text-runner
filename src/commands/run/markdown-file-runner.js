// @flow

const ActionManager = require('../../actions/action-manager.js')
const ActivityListBuilder = require('./activity-list-builder')
const {cyan} = require('chalk')
const delay = require('delay')
const fs = require('fs-extra')
const LinkTargetBuilder = require('./link-target-builder')
const MarkdownParser = require('./markdown-parser')
const path = require('path')
const util = require('util')

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
  async prepare (): Promise<void> {
    // Need to start the file here
    // so that the formatter has the filename
    // in case there are errors preparing.
    var markdownText = await fs.readFile(this.filePath, {encoding: 'utf8'})
    markdownText = markdownText.trim()
    if (markdownText.length === 0) {
      this.formatter.startFile(this.filePath)
      this.formatter.error(`found empty file ${cyan(path.relative(process.cwd(), this.filePath))}`)
      throw new Error('1')
    }
    const astNodeList = this.parser.parse(markdownText)
    const linkTargets = this.linkTargetBuilder.buildLinkTargets(this.filePath, astNodeList)
    this.runData = this.activityListBuilder.build(linkTargets)
  }

  // Runs this runner
  // (after it has been prepared)
  async run (): Promise<number> {
    for (let block of this.runData) {
      await this._runBlock(block)
    }
    return this.runData.length
  }

  async _runBlock (block) {
    // waiting 1 ms here to give Node a chance to run queued up logic from previous steps
    await delay(1)
    block.formatter.startFile(block.filename)
    block.formatter.setLines(block.startLine, block.endLine)
    try {
      if (block.runner.length === 1) {
      // synchronous action method or returns a promise
        await Promise.resolve(block.runner(block))
      } else {
      // asynchronous action method
        const promisified = util.promisify(block.runner)
        await promisified(block)
      }
    } catch (err) {
      if (err.message === '1') throw err
      if (!err.message) throw err
      block.formatter.error(err.message)
      throw new Error('1')
    }
  }
}

module.exports = MarkdownFileRunner
