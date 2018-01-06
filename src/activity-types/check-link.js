// @flow

import type {Activity} from '../commands/run/activity.js'
import type Configuration from '../configuration/configuration.js'
import type Formatter from '../formatters/formatter.js'
import type {LinkTargetList} from '../commands/run/link-target-list.js'

const {cyan, magenta, red} = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const request = require('request-promise-native')

// Checks for broken hyperlinks
module.exports = async function (activity: Activity) {
  const target = activity.nodes[0].content
  if (target == null || target === '') {
    throw new Error('link without target')
  }
  activity.formatter.action(`link to ${cyan(target)}`)
  if (isLinkToAnchorInSameFile(target)) {
    await checkLinkToAnchorInSameFile(activity.filename, target, activity.linkTargets, activity.formatter)
  } else if (isLinkToAnchorInOtherFile(target)) {
    await checkLinkToAnchorInOtherFile(activity.filename, target, activity.linkTargets, activity.formatter)
  } else if (isExternalLink(target)) {
    await checkExternalLink(target, activity.formatter, activity.configuration)
  } else {
    await checkLinkToFilesystem(activity.filename, target, activity.formatter)
  }
}

async function checkExternalLink (target: string, formatter: Formatter, configuration: Configuration) {
  if (configuration.get('fast')) {
    formatter.skip(`skipping link to external website ${target}`)
    return
  }

  try {
    formatter.action(`link to external website ${cyan(target)}`)
    await request({url: target, timeout: 4000})
  } catch (err) {
    if (err.statusCode === 404 || err.error.code === 'ENOTFOUND') {
      formatter.warning(`link to non-existing external website ${red(target)}`)
    } else if (err.message === 'ESOCKETTIMEDOUT') {
      formatter.warning(`link to ${magenta(target)} timed out`)
    } else if (err.message.startsWith("Hostname/IP doesn't match certificate's altnames")) {
      formatter.warning(`link to ${magenta(target)} has error: #{err.message}`)
    } else {
      formatter.warning(`error while checking link to ${magenta(target)}: ${err}`)
    }
  }
}

async function checkLinkToFilesystem (filename: string, target: string, formatter: Formatter) {
  target = path.join(path.dirname(filename), target)
  try {
    const stats = await fs.stat(target)
    if (stats.isDirectory()) {
      formatter.action(`link to local directory ${cyan(target)}`)
    } else {
      formatter.action(`link to local file ${cyan(target)}`)
    }
  } catch (err) {
    throw new Error(`link to non-existing local file ${red(target)}`)
  }
}

async function checkLinkToAnchorInSameFile (filename: string, target: string, linkTargets: LinkTargetList, formatter: Formatter) {
  const targetEntry = linkTargets[filename].filter((linkTarget) => linkTarget.name === target.substr(1))[0]
  if (!targetEntry) {
    throw new Error(`link to non-existing local anchor ${red(target)}`)
  }
  if (targetEntry.type === 'heading') {
    formatter.action(`link to local heading ${cyan(targetEntry.text)}`)
  } else {
    formatter.action(`link to #${cyan(targetEntry.name)}`)
  }
}

async function checkLinkToAnchorInOtherFile (filename: string, target: string, linkTargets: LinkTargetList, formatter: Formatter) {
  var [targetFilename, targetAnchor] = target.split('#')
  targetFilename = decodeURI(targetFilename)
  if (linkTargets[targetFilename] == null) {
    throw new Error(`link to anchor #${cyan(targetAnchor)} in non-existing file ${red(targetFilename)}`)
  }
  const targetEntry = (linkTargets[targetFilename] || []).filter((linkTarget) => linkTarget.name === targetAnchor)[0]
  if (!targetEntry) {
    throw new Error(`link to non-existing anchor #${red(targetAnchor)} in ${cyan(targetFilename)}`)
  }

  if (targetEntry.type === 'heading') {
    formatter.action(`link to heading ${cyan(targetEntry.text)} in ${cyan(targetFilename)}`)
  } else {
    formatter.action(`link to ${cyan(targetFilename)}#${cyan(targetAnchor)}`)
  }
}

function isExternalLink (target: string): boolean {
  return target.startsWith('//') || target.startsWith('http://') || target.startsWith('https://')
}

function isLinkToAnchorInOtherFile (target: string): boolean {
  if ((target.match(/#/g) || []).length !== 1) {
    return false
  } else if (/^https?:\/\//.test(target)) {
    return false
  } else {
    return true
  }
}

function isLinkToAnchorInSameFile (target: string): boolean {
  return target.startsWith('#')
}
