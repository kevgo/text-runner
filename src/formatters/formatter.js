// @flow

import type { Activity } from '../activity-list/activity.js'
import type { WriteStream } from 'observable-process'

const humanize = require('humanize-string')
const StatsCounter = require('../runners/stats-counter.js')

type Console = {
  log(text: string): void
}

// Base class for formatters
class Formatter {
  activity: Activity
  console: Console
  sourceDir: string
  statsCounter: StatsCounter
  stderr: WriteStream
  stdout: WriteStream
  output: string
  title: string
  skipped: boolean
  // TODO: remove this?
  warned: boolean

  constructor (
    activity: Activity,
    sourceDir: string,
    statsCounter: StatsCounter
  ) {
    this.activity = activity
    this.statsCounter = statsCounter
    this.stdout = { write: this.log.bind(this) }
    this.stderr = { write: this.log.bind(this) }
    this.output = ''
    this.title = humanize(activity.type)
    this.sourceDir = sourceDir
    this.skipped = false
    this.warned = false
  }

  error (errorMessage: string) {
    this.statsCounter.error()
  }

  log (text: string | Buffer): boolean {
    this.output += text.toString()
    return false
  }

  skip (message: string) {
    this.skipped = true
    this.statsCounter.skip()
  }

  success () {
    this.statsCounter.success()
  }

  // allows the user to set a new name for this step
  name (newTitle: string) {
    this.title = newTitle
  }

  warning (warningMessage: string) {
    this.warned = true
    this.statsCounter.warning()
  }
}

module.exports = Formatter
