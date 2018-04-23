// @flow

import type { Activity } from '../commands/run/4-activities/activity.js'
import type Configuration from '../configuration/configuration.js'
import type Formatter from '../formatters/formatter.js'

const { cyan, magenta, red } = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const request = require('request-promise-native')

// Checks for broken hyperlinks
module.exports = async function (activity: Activity) {
  const node = activity.nodes[0]
  var imagePath = node.attributes ? node.attributes.src : null
  if (!imagePath) {
    throw new Error('image tag without source')
  }
  if (!imagePath.startsWith('/')) {
    imagePath = path.join(path.dirname(activity.filename), imagePath)
  }
  activity.formatter.setTitle(`image ${cyan(imagePath)}`)
  if (isRemoteImage(imagePath)) {
    await checkRemoteImage(
      imagePath,
      activity.formatter,
      activity.configuration
    )
  } else {
    await checkLocalImage(imagePath, activity.formatter)
  }
}

async function checkLocalImage (imagePath: string, formatter: Formatter) {
  try {
    await fs.stat(path.join(process.cwd(), imagePath))
  } catch (err) {
    throw new Error(`image ${red(imagePath)} does not exist`)
  }
}

async function checkRemoteImage (url: string, f: Formatter, c: Configuration) {
  if (c.get('offline')) {
    f.skip(`skipping external image: ${magenta(url)}`)
    return
  }
  try {
    await request({ url: url, timeout: 2000 })
  } catch (err) {
    if (err.statusCode === 404) {
      f.warning(`image ${magenta(url)} does not exist`)
    } else if (err.message === 'ESOCKETTIMEDOUT') {
      f.warning(`image ${magenta(url)} timed out`)
    } else {
      throw err
    }
  }
}

function isRemoteImage (imagePath: string): boolean {
  if (imagePath != null) {
    return (
      imagePath.startsWith('//') ||
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://')
    )
  } else {
    return false
  }
}
