import { Configuration } from '../configuration/configuration'
import { ActionArgs } from '../runners/action-args'

import chalk from 'chalk'
import fs from 'fs-extra'
import got from 'got'
import path from 'path'
import AbsoluteFilePath from '../domain-model/absolute-file-path'
import UnknownLink from '../domain-model/unknown-link'
import Formatter from '../formatters/formatter'
import isExternalLink from '../helpers/is-external-link'
import isLinkToAnchorInOtherFile from '../helpers/is-link-to-anchor-in-other-file'
import isLinkToAnchorInSameFile from '../helpers/is-link-to-anchor-in-same-file'
import isMailtoLink from '../helpers/is-mailto-link'
import removeLeadingSlash from '../helpers/remove-leading-slash'
import LinkTargetList from '../link-targets/link-target-list'

// Checks for broken hyperlinks
export default (async function(args: ActionArgs) {
  const target = args.nodes[0].attributes.href
  if (target == null || target === '') {
    throw new Error('link without target')
  }

  if (isMailtoLink(target)) {
    args.formatter.skip(`skipping link to ${chalk.cyan(target)}`)
    return
  }

  args.formatter.name(`link to ${chalk.cyan(target)}`)
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
})

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
    f.name(`link to external website ${chalk.cyan(target)}`)
    await got(target, { timeout: 4000 })
  } catch (err) {
    if (err.statusCode === 404 || err.code === 'ENOTFOUND') {
      f.warning(`link to non-existing external website ${chalk.bold(target)}`)
    } else if (err instanceof got.TimeoutError) {
      f.warning(`link to ${chalk.magenta(target)} timed out`)
    } else if (
      err.message.startsWith("Hostname/IP doesn't match certificate's altnames")
    ) {
      f.warning(`link to ${chalk.magenta(target)} has error: #{err.message}`)
    } else {
      f.warning(`error while checking link to ${chalk.magenta(target)}: ${err}`)
    }
  }
}

async function checkLinkToFilesystem(
  containingFile: AbsoluteFilePath,
  target: string,
  f: Formatter,
  c: Configuration
) {
  const unknownLink = new UnknownLink(decodeURI(target))
  const absoluteLink = unknownLink.absolutify(containingFile, c.publications)
  const linkedFile = absoluteLink.localize(c.publications, c.defaultFile)
  const fullPath = path.join(c.sourceDir, linkedFile.platformified())

  // We only check for directories if no defaultFile is set.
  // Otherwise links to folders point to the default file.
  if (!c.defaultFile) {
    try {
      const stats = await fs.stat(fullPath)
      if (stats.isDirectory()) {
        f.name(
          `link to local directory ${chalk.cyan(linkedFile.platformified())}`
        )
        return
      }
    } catch (e) {
      // we can ignore errors here since we keep checking the file below
    }
  }

  f.name(`link to local file ${chalk.cyan(linkedFile.platformified())}`)
  try {
    await fs.stat(fullPath)
  } catch (err) {
    throw new Error(
      `link to non-existing local file ${chalk.bold(
        linkedFile.platformified()
      )}`
    )
  }
}

async function checkLinkToAnchorInSameFile(
  containingFile: AbsoluteFilePath,
  target: string,
  linkTargets: LinkTargetList,
  f: Formatter
) {
  const anchorName = target.substr(1)
  if (!linkTargets.hasAnchor(containingFile, anchorName)) {
    throw new Error(`link to non-existing local anchor ${chalk.bold(target)}`)
  }
  if (linkTargets.anchorType(containingFile, anchorName) === 'heading') {
    f.name(`link to local heading ${chalk.cyan(target)}`)
  } else {
    f.name(`link to #${chalk.cyan(anchorName)}`)
  }
}

async function checkLinkToAnchorInOtherFile(
  containingFile: AbsoluteFilePath,
  target: string,
  linkTargets: LinkTargetList,
  f: Formatter,
  c: Configuration
) {
  const link = new UnknownLink(target)
  const absoluteLink = link.absolutify(containingFile, c.publications)
  const filePath = absoluteLink.localize(c.publications, c.defaultFile)
  const anchorName = absoluteLink.anchor()

  if (!linkTargets.hasFile(filePath)) {
    throw new Error(
      `link to anchor #${chalk.cyan(
        anchorName
      )} in non-existing file ${chalk.cyan(
        removeLeadingSlash(filePath.platformified())
      )}`
    )
  }

  if (!linkTargets.hasAnchor(filePath, anchorName)) {
    throw new Error(
      `link to non-existing anchor ${chalk.bold(
        '#' + anchorName
      )} in ${chalk.bold(filePath.platformified())}`
    )
  }

  if (linkTargets.anchorType(filePath, anchorName) === 'heading') {
    f.name(
      `link to heading ${chalk.cyan(
        filePath.platformified() + '#' + anchorName
      )}`
    )
  } else {
    f.name(
      `link to ${chalk.cyan(filePath.platformified())}#${chalk.cyan(
        anchorName
      )}`
    )
  }
}
