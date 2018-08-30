// @flow

import type { ActionArgs } from '../runners/action-args.js'
import type { Configuration } from '../configuration/configuration.js'

const { cyan, magenta, red } = require('chalk')
const Formatter = require('../formatters/formatter.js')
const fs = require('fs-extra')
const path = require('path')
const request = require('request-promise-native')

// Checks for broken hyperlinks
module.exports = async function (args: ActionArgs) {
  const node = args.nodes[0]
  var imagePath = node.attributes ? node.attributes.src : null
  if (!imagePath) {
    throw new Error('image tag without source')
  }
  args.formatter.name(`image ${cyan(imagePath)}`)
  if (isRemoteImage(imagePath)) {
    await checkRemoteImage(imagePath, args.formatter, args.configuration)
  } else {
    if (!imagePath.startsWith('/')) {
      imagePath = path.join(path.dirname(node.file.platformified()), imagePath)
    }
    await checkLocalImage(imagePath, args.formatter, args.configuration)
  }
}

async function checkLocalImage (
  imagePath: string,
  formatter: Formatter,
  c: Configuration
) {
  try {
    await fs.stat(path.join(c.sourceDir, imagePath))
  } catch (err) {
    throw new Error(`image ${red(imagePath)} does not exist`)
  }
}

async function checkRemoteImage (url: string, f: Formatter, c: Configuration) {
  if (c.offline) {
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
