// @flow

import type {Activity} from '../../typedefs/activity.js'
import type {AstNode} from '../../typedefs/ast-node.js'
import type {AstNodeList} from '../../typedefs/ast-node-list.js'
import type Configuration from '../../configuration.js'
import type Formatter from '../../formatters/formatter.js'

const {cyan, magenta, red} = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const request = require('request-promise-native')

// Checks for broken hyperlinks
module.exports = async function (activity: Activity) {
  activity.formatter.action(`checking image`)
  const node = activity.nodes[0]
  if (node.src == null || node.src === '') {
    throw new Error('image tag without source')
  }
  const imagePath = path.join(path.dirname(activity.filename), node.src)
  activity.formatter.action(`image ${cyan(imagePath)}`)
  if (isRemoteImage(node)) {
    await checkRemoteImage(node, activity.formatter, activity.configuration)
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

async function checkRemoteImage (node: AstNode, formatter: Formatter, configuration: Configuration) {
  if (configuration.get('fast')) {
    formatter.skip(`skipping external image ${node.src || ''}`)
    return
  }

  try {
    await request({url: node.src, timeout: 2000})
  } catch (err) {
    if (err.statusCode === 404) {
      formatter.warning(`image ${magenta(node.src)} does not exist`)
    } else if (err.message === 'ESOCKETTIMEDOUT') {
      formatter.warning(`image ${magenta(node.src)} timed out`)
    } else {
      throw err
    }
  }
}

function isRemoteImage (node: AstNode): boolean {
  if (node.src != null) {
    // $FlowFixMe
    return node.src.startsWith('//') || node.src.startsWith('http://') || node.src.startsWith('https://')
  } else {
    return false
  }
}
