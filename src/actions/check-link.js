// @flow

import type { ActionArgs } from '../runners/action-args.js'
import type { Configuration } from '../configuration/configuration.js'

const addLeadingSlash = require('../helpers/add-leading-slash.js')
const publicToLocalFilePath = require('../helpers/public-to-local-file-path.js')
const { bold, cyan, magenta } = require('chalk')
const isRelativePath = require('../helpers/is-relative-path.js')
const Formatter = require('../formatters/formatter.js')
const fs = require('fs-extra')
const LinkTargetList = require('../link-targets/link-target-list.js')
const localToPublicFilePath = require('../helpers/local-to-public-file-path.js')
const normalizePath = require('../helpers/normalize-path.js')
const path = require('path')
const relativeToAbsoluteLink = require('../helpers/relative-to-absolute-link.js')
const removeLeadingSlash = require('../helpers/remove-leading-slash.js')
const request = require('request-promise-native')
const url = require('url')

// Checks for broken hyperlinks
module.exports = async function(args: ActionArgs) {
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
    return
  }

  if (isLinkToAnchorInOtherFile(target)) {
    await checkLinkToAnchorInOtherFile(
      args.file,
      target,
      args.linkTargets,
      args.formatter,
      args.configuration
    )
    return
  }

  if (isExternalLink(target)) {
    await checkExternalLink(target, args.formatter, args.configuration)
    return
  }

  await checkLinkToFilesystem(
    args.file,
    target,
    args.formatter,
    args.configuration
  )
}

async function checkExternalLink(
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

async function checkLinkToFilesystem(
  filename: string,
  target: string,
  f: Formatter,
  c: Configuration
) {
  var relativePath = target.startsWith('/')
    ? target
    : '/' + path.join(path.dirname(filename), target)
  var fullPath = normalizePath(path.join(c.sourceDir, relativePath))
  console.log('relative path before reversePublication: ' + relativePath)

  // we only check for directories if no defaultFile is set - otherwise links to folders point to the default file
  if (!c.defaultFile) {
    try {
      const stats = await fs.stat(fullPath)
      if (stats.isDirectory()) {
        f.name(
          `link to local directory ${cyan(removeLeadingSlash(relativePath))}`
        )
        return
      }
    } catch (e) {
      // we can ignore errors here since we keep checking the file below
    }
  }

  try {
    relativePath = publicToLocalFilePath(
      relativePath,
      c.publications,
      c.defaultFile
    )
    console.log('relative path after reversePublication: ' + relativePath)
    fullPath = normalizePath(path.join(c.sourceDir, relativePath))
    f.name(`link to local file ${cyan(removeLeadingSlash(relativePath))}`)
    await fs.stat(fullPath)
  } catch (err) {
    throw new Error(
      `link to non-existing local file ${bold(
        removeLeadingSlash(relativePath)
      )}`
    )
  }
}

async function checkLinkToAnchorInSameFile(
  filename: string,
  target: string,
  linkTargets: LinkTargetList,
  f: Formatter
) {
  const anchorEntry = (
    linkTargets.targets[addLeadingSlash(filename)] || []
  ).filter(linkTarget => linkTarget.name === target.substr(1))[0]
  if (!anchorEntry) {
    throw new Error(`link to non-existing local anchor ${bold(target)}`)
  }
  if (anchorEntry.type === 'heading') {
    f.name(`link to local heading ${cyan(target)}`)
  } else {
    f.name(`link to #${cyan(anchorEntry.name)}`)
  }
}

async function checkLinkToAnchorInOtherFile(
  filename: string,
  target: string,
  linkTargets: LinkTargetList,
  f: Formatter,
  c: Configuration
) {
  console.log('filename', filename)

  // parse the link into the relative url
  console.log('target', target)
  let [relativeUrl, anchor] = target.split('#')
  relativeUrl = decodeURI(relativeUrl)
  console.log('relativeUrl', relativeUrl)

  // determine the absolute url
  let absoluteUrl = relativeUrl
  if (isRelativePath(relativeUrl)) {
    absoluteUrl = relativeToAbsoluteLink(
      relativeUrl,
      filename,
      c.publications,
      c.defaultFile
    )
  }
  console.log('absoluteUrl', absoluteUrl)

  // determine the local file path of the linked file
  const localLinkFilePath = publicToLocalFilePath(
    absoluteUrl,
    c.publications,
    c.defaultFile
  )
  console.log('localLinkFilePath', localLinkFilePath)

  // ensure the local file exists
  if (linkTargets.targets[localLinkFilePath] == null) {
    throw new Error(
      `link to anchor #${cyan(anchor)} in non-existing file ${cyan(
        removeLeadingSlash(localLinkFilePath)

        // ensure the local file exists
      )}`
    )
  }

  // ensure the anchor exists in the file
  const anchorEntry = (linkTargets.targets[localLinkFilePath] || []).filter(
    linkTarget => linkTarget.name === anchor
  )[0]
  if (!anchorEntry) {
    throw new Error(
      `link to non-existing anchor ${bold('#' + anchor)} in ${bold(
        removeLeadingSlash(localLinkFilePath)
      )}`
    )
  }

  // Signal anchor type to user
  if (anchorEntry.type === 'heading') {
    f.name(
      `link to heading ${cyan(
        removeLeadingSlash(localLinkFilePath) + '#' + anchor
      )}`
    )
  } else {
    f.name(
      `link to ${cyan(removeLeadingSlash(localLinkFilePath))}#${cyan(anchor)}`
    )
  }
}

function isExternalLink(target: string): boolean {
  return target.startsWith('//') || !!url.parse(target).protocol
}

function isLinkToAnchorInOtherFile(target: string): boolean {
  if ((target.match(/#/g) || []).length !== 1) {
    return false
  } else if (/^https?:\/\//.test(target)) {
    return false
  } else {
    return true
  }
}

function isLinkToAnchorInSameFile(target: string): boolean {
  return target.startsWith('#')
}

function isMailtoLink(target: string): boolean {
  return target.startsWith('mailto:')
}
