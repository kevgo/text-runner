// @flow

import type { ActionArgs } from '../runners/action-args.js'
import type { Configuration } from '../configuration/configuration.js'

const { bold, cyan, magenta } = require('chalk')
const Formatter = require('../formatters/formatter.js')
const fs = require('fs-extra')
const LinkTargetList = require('../link-targets/link-target-list.js')
const path = require('path')
const request = require('request-promise-native')
const url = require('url')

// Checks for broken hyperlinks
module.exports = async function (args: ActionArgs) {
  const target = args.nodes[0].attributes['href']
  if (target == null || target === '') {
    throw new Error('link without target')
  }
  if (isMailtoLink(target)) {
    args.formatter.skip(`skipping link to ${cyan(target)}`)
    return
  }
  args.formatter.name(`link to ${cyan(target)}`)
  if (isLinkToAnchorInSameFile(target)) {
    await checkLinkToAnchorInSameFile(
      args.file,
      target,
      args.linkTargets,
      args.formatter
    )
  } else if (isLinkToAnchorInOtherFile(target)) {
    const targetFullPath = path
      .join(path.dirname(args.file), target)
      .replace(/\\/g, '/') // this line is necessary to make this work on Windows
    await checkLinkToAnchorInOtherFile(
      args.file,
      targetFullPath,
      args.linkTargets,
      args.formatter
    )
  } else if (isExternalLink(target)) {
    await checkExternalLink(target, args.formatter, args.configuration)
  } else {
    await checkLinkToFilesystem(
      args.file,
      target,
      args.formatter,
      args.configuration
    )
  }
}

async function checkExternalLink (
  target: string,
  f: Formatter,
  c: Configuration
) {
  if (c.offline) {
    f.skip(`skipping external link: ${target}`)
    return
  }

  try {
    f.name(`link to external website ${cyan(target)}`)
    await request({ url: target, timeout: 4000 })
  } catch (err) {
    if (err.statusCode === 404 || err.error.code === 'ENOTFOUND') {
      f.warning(`link to non-existing external website ${bold(target)}`)
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
  f: Formatter,
  c: Configuration
) {
  if (target.startsWith('/')) {
    target = target.substr(1)
  } else {
    target = path.join(path.dirname(filename), target)
  }
  try {
    const stats = await fs.stat(path.join(c.sourceDir, target))
    if (stats.isDirectory()) {
      f.name(`link to local directory ${cyan(target)}`)
    } else {
      f.name(`link to local file ${cyan(target)}`)
    }
  } catch (err) {
    throw new Error(`link to non-existing local file ${bold(target)}`)
  }
}

async function checkLinkToAnchorInSameFile (
  filename: string,
  target: string,
  linkTargets: LinkTargetList,
  f: Formatter
) {
  const targetEntry = (linkTargets.targets[filename] || []).filter(
    linkTarget => linkTarget.name === target.substr(1)
  )[0]
  if (!targetEntry) {
    throw new Error(`link to non-existing local anchor ${bold(target)}`)
  }
  if (targetEntry.type === 'heading') {
    f.name(`link to local heading ${cyan(target)}`)
  } else {
    f.name(`link to #${cyan(targetEntry.name)}`)
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
  if (linkTargets.targets[targetFilename] == null) {
    throw new Error(
      `link to anchor #${cyan(targetAnchor)} in non-existing file ${cyan(
        targetFilename
      )}`
    )
  }
  const targetEntry = (linkTargets.targets[targetFilename] || []).filter(
    linkTarget => linkTarget.name === targetAnchor
  )[0]
  if (!targetEntry) {
    throw new Error(
      `link to non-existing anchor ${bold('#' + targetAnchor)} in ${bold(
        targetFilename
      )}`
    )
  }

  if (targetEntry.type === 'heading') {
    f.name(`link to heading ${cyan(target)}`)
  } else {
    f.name(`link to ${cyan(targetFilename)}#${cyan(targetAnchor)}`)
  }
}

function isExternalLink (target: string): boolean {
  return target.startsWith('//') || !!url.parse(target).protocol
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
