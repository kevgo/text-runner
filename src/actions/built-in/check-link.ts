import color from "colorette"
import fs from "fs-extra"
import got from "got"
import path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { UnknownLink } from "../../filesystem/unknown-link"
import { removeLeadingSlash } from "../../helpers/remove-leading-slash"
import { isExternalLink } from "../helpers/is-external-link"
import { isLinkToAnchorInOtherFile } from "../helpers/is-link-to-anchor-in-other-file"
import { isLinkToAnchorInSameFile } from "../helpers/is-link-to-anchor-in-same-file"
import { isMailtoLink } from "../helpers/is-mailto-link"
import { ActionArgs } from "../types/action-args"

/** The "checkLink" action checks for broken hyperlinks. */
export default async function checkLink(args: ActionArgs) {
  const target = args.nodes.getNodeOfTypes("link_open").attributes.href
  if (target == null || target === "") {
    throw new Error("link without target")
  }

  args.name(`link to ${color.cyan(target)}`)
  const filePath = new AbsoluteFilePath(args.file)

  if (isMailtoLink(target)) {
    return args.SKIPPING
  }

  if (isLinkToAnchorInSameFile(target)) {
    const result = await checkLinkToAnchorInSameFile(filePath, target, args)
    return result
  }

  if (isLinkToAnchorInOtherFile(target)) {
    const result = await checkLinkToAnchorInOtherFile(filePath, target, args)
    return result
  }

  if (isExternalLink(target)) {
    const result = await checkExternalLink(target, args)
    return result
  }

  await checkLinkToFilesystem(target, args)
  return
}

async function checkExternalLink(target: string, args: ActionArgs) {
  if (args.configuration.offline) {
    return args.SKIPPING
  }

  try {
    args.name(`link to external website ${color.cyan(target)}`)
    await got(target, { timeout: 4000 })
  } catch (err) {
    if (err.statusCode === 404 || err.code === "ENOTFOUND") {
      args.log("external website doesn't exist")
    } else if (err instanceof got.TimeoutError) {
      args.log("timed out")
    } else {
      args.log(
        `error while checking link to ${color.cyan(target)}: ${err.message}`
      )
    }
  }
  return
}

async function checkLinkToFilesystem(target: string, args: ActionArgs) {
  const unknownLink = new UnknownLink(decodeURI(target))
  const absoluteLink = unknownLink.absolutify(
    new AbsoluteFilePath(args.file),
    args.configuration.publications
  )
  const linkedFile = absoluteLink.localize(
    args.configuration.publications,
    args.configuration.defaultFile
  )
  const fullPath = path.join(
    args.configuration.sourceDir,
    linkedFile.platformified()
  )

  // We only check for directories if no defaultFile is set.
  // Otherwise links to folders point to the default file.
  if (!args.configuration.defaultFile) {
    try {
      const stats = await fs.stat(fullPath)
      if (stats.isDirectory()) {
        args.name(
          `link to local directory ${color.cyan(linkedFile.platformified())}`
        )
        return
      }
    } catch (e) {
      // we can ignore errors here since we keep checking the file below
    }
  }

  args.name(`link to local file ${color.cyan(linkedFile.platformified())}`)
  try {
    await fs.stat(fullPath)
  } catch (err) {
    throw new Error(
      `link to non-existing local file ${color.bold(
        linkedFile.platformified()
      )}`
    )
  }
}

async function checkLinkToAnchorInSameFile(
  containingFile: AbsoluteFilePath,
  target: string,
  args: ActionArgs
) {
  const anchorName = target.substr(1)
  if (!args.linkTargets.hasAnchor(containingFile, anchorName)) {
    throw new Error(`link to non-existing local anchor ${color.bold(target)}`)
  }
  if (args.linkTargets.anchorType(containingFile, anchorName) === "heading") {
    args.name(`link to local heading ${color.cyan(target)}`)
  } else {
    args.name(`link to #${color.cyan(anchorName)}`)
  }
}

async function checkLinkToAnchorInOtherFile(
  containingFile: AbsoluteFilePath,
  target: string,
  args: ActionArgs
) {
  const link = new UnknownLink(target)
  const absoluteLink = link.absolutify(
    containingFile,
    args.configuration.publications
  )
  const filePath = absoluteLink.localize(
    args.configuration.publications,
    args.configuration.defaultFile
  )
  const anchorName = absoluteLink.anchor()

  if (!args.linkTargets.hasFile(filePath)) {
    throw new Error(
      `link to anchor #${color.cyan(
        anchorName
      )} in non-existing file ${color.cyan(
        removeLeadingSlash(filePath.platformified())
      )}`
    )
  }

  if (!args.linkTargets.hasAnchor(filePath, anchorName)) {
    throw new Error(
      `link to non-existing anchor ${color.bold(
        "#" + anchorName
      )} in ${color.bold(filePath.platformified())}`
    )
  }

  if (args.linkTargets.anchorType(filePath, anchorName) === "heading") {
    args.name(
      `link to heading ${color.cyan(
        filePath.platformified() + "#" + anchorName
      )}`
    )
  } else {
    args.name(
      `link to ${color.cyan(filePath.platformified())}#${color.cyan(
        anchorName
      )}`
    )
  }
}
