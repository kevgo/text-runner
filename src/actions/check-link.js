// @flow

import type { ActionArgs } from '../runners/action-args.js'
import type { Configuration } from '../configuration/configuration.js'

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const { bold, cyan, magenta } = require('chalk')
const Formatter = require('../formatters/formatter.js')
const fs = require('fs-extra')
const isExternalLink = require('../helpers/is-external-link.js')
const isLinkToAnchorInOtherFile = require('../helpers/is-link-to-anchor-in-other-file.js')
const isLinkToAnchorInSameFile = require('../helpers/is-link-to-anchor-in-same-file.js')
const isMailtoLink = require('../helpers/is-mailto-link.js')
const LinkTargetList = require('../link-targets/link-target-list.js')
const path = require('path')
const removeLeadingSlash = require('../helpers/remove-leading-slash.js')
const request = require('request-promise-native')
const UnknownLink = require('../domain-model/unknown-link.js')

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
  const filePath = new AbsoluteFilePath(args.file)

  if (isLinkToAnchorInSameFile(target)) {
    await checkLinkToAnchorInSameFile(
      filePath,
      target,
      args.linkTargets,
      args.formatter
    )
    return
  }

  if (isLinkToAnchorInOtherFile(target)) {
    await checkLinkToAnchorInOtherFile(
      filePath,
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
    filePath,
    target,
    args.formatter,
    args.configuration
  )
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
  containingFile: AbsoluteFilePath,
  target: string,
  f: Formatter,
  c: Configuration
) {
  const unknownLink = new UnknownLink(decodeURI(target))
  const absoluteLink = unknownLink.absolutify(
    containingFile,
    c.publications,
    c.defaultFile
  )
  const linkedFile = absoluteLink.localize(c.publications, c.defaultFile)
  const fullPath = path.join(c.sourceDir, linkedFile.platformified())

  // We only check for directories if no defaultFile is set.
  // Otherwise links to folders point to the default file.
  if (!c.defaultFile) {
    try {
      const stats = await fs.stat(fullPath)
      if (stats.isDirectory()) {
        f.name(`link to local directory ${cyan(linkedFile.platformified())}`)
        return
      }
    } catch (e) {
      // we can ignore errors here since we keep checking the file below
    }
  }

  f.name(`link to local file ${cyan(linkedFile.platformified())}`)
  try {
    await fs.stat(fullPath)
  } catch (err) {
    throw new Error(
      `link to non-existing local file ${bold(linkedFile.platformified())}`
    )
  }
}

async function checkLinkToAnchorInSameFile (
  containingFile: AbsoluteFilePath,
  target: string,
  linkTargets: LinkTargetList,
  f: Formatter
) {
  const anchorName = target.substr(1)
  if (!linkTargets.hasAnchor(containingFile, anchorName)) {
    throw new Error(`link to non-existing local anchor ${bold(target)}`)
  }
  if (linkTargets.anchorType(containingFile, anchorName) === 'heading') {
    f.name(`link to local heading ${cyan(target)}`)
  } else {
    f.name(`link to #${cyan(anchorName)}`)
  }
}

async function checkLinkToAnchorInOtherFile (
  containingFile: AbsoluteFilePath,
  target: string,
  linkTargets: LinkTargetList,
  f: Formatter,
  c: Configuration
) {
  const link = new UnknownLink(target)
  const absoluteLink = link.absolutify(
    containingFile,
    c.publications,
    c.defaultFile
  )
  const filePath = absoluteLink.localize(c.publications, c.defaultFile)
  const anchorName = absoluteLink.anchor()

  if (!linkTargets.hasFile(filePath)) {
    throw new Error(
      `link to anchor #${cyan(anchorName)} in non-existing file ${cyan(
        removeLeadingSlash(filePath.platformified())
      )}`
    )
  }

  if (!linkTargets.hasAnchor(filePath, anchorName)) {
    throw new Error(
      `link to non-existing anchor ${bold('#' + anchorName)} in ${bold(
        filePath.platformified()
      )}`
    )
  }

  if (linkTargets.anchorType(filePath, anchorName) === 'heading') {
    f.name(
      `link to heading ${cyan(filePath.platformified() + '#' + anchorName)}`
    )
  } else {
    f.name(`link to ${cyan(filePath.platformified())}#${cyan(anchorName)}`)
  }
}
