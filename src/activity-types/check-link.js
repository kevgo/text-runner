// @flow

import type { Activity } from '../commands/run/activity.js'
import type Configuration from '../configuration/configuration.js'
import type Formatter from '../formatters/formatter.js'
import type { LinkTargetList } from '../commands/run/link-target-list.js'

const { cyan, magenta } = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const request = require('request-promise-native')

// Checks for broken hyperlinks
module.exports = async function (act: Activity) {
  const target = act.nodes[0].content
  if (target == null || target === '') {
    throw new Error('link without target')
  }
  if (isMailtoLink(target)) {
    act.formatter.skip(`skipping link to ${cyan(target)}`)
    return
  }
  act.formatter.setTitle(`link to ${cyan(target)}`)
  if (isLinkToAnchorInSameFile(target)) {
    await checkLinkToAnchorInSameFile(
      act.filename,
      target,
      act.linkTargets,
      act.formatter
    )
  } else if (isLinkToAnchorInOtherFile(target)) {
    const targetFullPath = path
      .join(path.dirname(act.filename), target)
      .replace(/\\/g, '/') // this line is necessary to make this work on Windows
    await checkLinkToAnchorInOtherFile(
      act.filename,
      targetFullPath,
      act.linkTargets,
      act.formatter
    )
  } else if (isExternalLink(target)) {
    await checkExternalLink(target, act.formatter, act.configuration)
  } else {
    await checkLinkToFilesystem(act.filename, target, act.formatter)
  }
}

async function checkExternalLink (
  target: string,
  f: Formatter,
  c: Configuration
) {
  if (c.get('offline')) {
    f.skip(`skipping link to external website ${target}`)
    return
  }

  try {
    f.setTitle(`link to external website ${cyan(target)}`)
    await request({ url: target, timeout: 4000 })
  } catch (err) {
    if (err.statusCode === 404 || err.error.code === 'ENOTFOUND') {
      f.warning(`link to non-existing external website ${cyan(target)}`)
    } else if (err.message === 'ESOCKETTIMEDOUT') {
      f.warning(`link to ${magenta(target)} timed out`)
    } else if (
      err.message.startsWith("Hostname/IP doesn't match certificate's altnames")
    ) {
      f.warning(`link to ${magenta(target)} has error: #{err.message}`)
    } else {
      f.warning(`error while checking link to ${magenta(target)}: ${err}`)
    }
  }
}

async function checkLinkToFilesystem (
  filename: string,
  target: string,
  f: Formatter
) {
  if (target.startsWith('/')) {
    target = target.substr(1)
  } else {
    target = path.join(path.dirname(filename), target)
  }
  try {
    const stats = await fs.stat(target)
    if (stats.isDirectory()) {
      f.setTitle(`link to local directory ${cyan(target)}`)
    } else {
      f.setTitle(`link to local file ${cyan(target)}`)
    }
  } catch (err) {
    throw new Error(`link to non-existing local file ${cyan(target)}`)
  }
}

async function checkLinkToAnchorInSameFile (
  filename: string,
  target: string,
  linkTargets: LinkTargetList,
  f: Formatter
) {
  const targetEntry = linkTargets[filename].filter(
    linkTarget => linkTarget.name === target.substr(1)
  )[0]
  if (!targetEntry) {
    throw new Error(`link to non-existing local anchor ${cyan(target)}`)
  }
  if (targetEntry.type === 'heading') {
    f.setTitle(`link to local heading ${cyan(targetEntry.text)}`)
  } else {
    f.setTitle(`link to #${cyan(targetEntry.name)}`)
  }
}

async function checkLinkToAnchorInOtherFile (
  filename: string,
  target: string,
  linkTargets: LinkTargetList,
  f: Formatter
) {
  var [targetFilename, targetAnchor] = target.split('#')
  targetFilename = decodeURI(targetFilename)
  if (linkTargets[targetFilename] == null) {
    throw new Error(
      `link to anchor #${cyan(targetAnchor)} in non-existing file ${cyan(
        targetFilename
      )}`
    )
  }
  const targetEntry = (linkTargets[targetFilename] || []).filter(
    linkTarget => linkTarget.name === targetAnchor
  )[0]
  if (!targetEntry) {
    throw new Error(
      `link to non-existing anchor #${cyan(targetAnchor)} in ${cyan(
        targetFilename
      )}`
    )
  }

  if (targetEntry.type === 'heading') {
    f.setTitle(
      `link to heading ${cyan(targetEntry.text)} in ${cyan(targetFilename)}`
    )
  } else {
    f.setTitle(`link to ${cyan(targetFilename)}#${cyan(targetAnchor)}`)
  }
}

function isExternalLink (target: string): boolean {
  return (
    target.startsWith('//') ||
    target.startsWith('http://') ||
    target.startsWith('https://')
  )
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

function isMailtoLink (target: string): boolean {
  return target.startsWith('mailto:')
}
