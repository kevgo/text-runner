// @flow

import type { ActivityList } from './activity-list.js'
import type Configuration from '../../configuration/configuration.js'
import type Formatter from '../../formatters/formatter.js'
import type { LinkTargetList } from './link-target-list.js'

const ActivityTypeManager = require('./activity-type-manager.js')
const ActivityListBuilder = require('./activity-list-builder')
const { cyan } = require('chalk')
const fs = require('fs-extra')
const LinkTargetListBuilder = require('./link-target-list-builder.js')
const MarkdownParser = require('../../parsers/markdown/markdown-parser')
const path = require('path')
const UnprintedUserError = require('../../errors/unprinted-user-error.js')
const util = require('util')

// Runs the given Markdown file
class MarkdownFileRunner {
  filePath: string
  formatter: Formatter
  activityTypesManager: ActivityTypeManager
  configuration: Configuration
  parser: MarkdownParser
  activityListBuilder: ActivityListBuilder
  linkTargetBuilder: LinkTargetListBuilder
  runData: ActivityList

  constructor (value: {
    filePath: string,
    formatter: Formatter,
    activityTypesManager: ActivityTypeManager,
    configuration: Configuration,
    linkTargets: LinkTargetList
  }) {
    this.filePath = value.filePath
    this.formatter = value.formatter
    this.configuration = value.configuration
    this.parser = new MarkdownParser()
    this.activityListBuilder = new ActivityListBuilder({
      activityTypesManager: value.activityTypesManager,
      filePath: this.filePath,
      formatter: this.formatter,
      configuration: this.configuration,
      linkTargets: value.linkTargets
    })
    this.linkTargetBuilder = new LinkTargetListBuilder({
      linkTargets: value.linkTargets
    })
  }

  // Prepares this runner
  async prepare () {
    // Need to start the file here
    // so that the formatter has the filename
    // in case there are errors preparing.
    this.formatter.startFile(this.filePath)
    var markdownText = await fs.readFile(this.filePath, { encoding: 'utf8' })
    markdownText = markdownText.trim()
    if (markdownText.length === 0) {
      throw new UnprintedUserError(
        `found empty file ${cyan(path.relative(process.cwd(), this.filePath))}`
      )
    }
    const astNodeList = this.parser.parse(markdownText)
    const linkTargets = this.linkTargetBuilder.buildLinkTargets(
      this.filePath,
      astNodeList
    )
    this.runData = this.activityListBuilder.build(linkTargets)
  }

  // Runs this runner
  // (after it has been prepared)
  async run (): Promise<number> {
    this.formatter.startFile(this.filePath)
    for (let activity of this.runData) {
      await this._runActivity(activity)
    }
    return this.runData.length
  }

  async _runActivity (activity) {
    this.formatter.setLines(activity.line)
    this.formatter.startActivity(activity.activityTypeName)
    try {
      if (activity.runner.length === 1) {
        // synchronous activity or returns a promise
        await Promise.resolve(activity.runner(activity))
      } else {
        // asynchronous activity
        const promisified = util.promisify(activity.runner)
        await promisified(activity)
      }
      activity.formatter.success()
    } catch (err) {
      if (isUserError(err)) {
        throw new UnprintedUserError(
          err.message,
          activity.filename,
          activity.line
        )
      } else {
        // here we have a developer error
        throw err
      }
    }
  }
}

function isUserError (err: Error): boolean {
  return err.name === 'Error'
}

module.exports = MarkdownFileRunner
