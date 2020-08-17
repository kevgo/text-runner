import * as color from "colorette"
import * as fs from "fs-extra"
import got from "got"
import * as path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { UnknownLink } from "../../filesystem/unknown-link"
import { removeLeadingSlash } from "../../helpers/remove-leading-slash"
import { isExternalLink } from "../helpers/is-external-link"
import { isLinkToAnchorInOtherFile } from "../helpers/is-link-to-anchor-in-other-file"
import { isLinkToAnchorInSameFile } from "../helpers/is-link-to-anchor-in-same-file"
import { isMailtoLink } from "../helpers/is-mailto-link"
import { ActionArgs } from "../types/action-args"

/** The "checkLink" action checks for broken hyperlinks. */
export async function checkLink(action: ActionArgs) {
  const target = action.nodes.getNodeOfTypes("link_open").attributes.href
  if (target == null || target === "") {
    throw new Error("link without target")
  }

  action.name(`link to ${color.cyan(target)}`)
  const filePath = new AbsoluteFilePath(action.file)

  if (isMailtoLink(target)) {
    return action.SKIPPING
  }

  if (isLinkToAnchorInSameFile(target)) {
    const result = await checkLinkToAnchorInSameFile(filePath, target, action)
    return result
  }

  if (isLinkToAnchorInOtherFile(target)) {
    const result = await checkLinkToAnchorInOtherFile(filePath, target, action)
    return result
  }

  if (isExternalLink(target)) {
    const result = await checkExternalLink(target, action)
    return result
  }

  await checkLinkToFilesystem(target, action)
  return
}

async function checkExternalLink(target: string, action: ActionArgs) {
  if (action.configuration.offline) {
    return action.SKIPPING
  }

  try {
    action.name(`link to external website ${color.cyan(target)}`)
    await got(target, { timeout: 4000 })
  } catch (err) {
    if (err.statusCode === 404 || err.code === "ENOTFOUND") {
      action.log("external website doesn't exist")
    } else if (err instanceof got.TimeoutError) {
      action.log("timed out")
    } else {
      action.log(`error while checking link to ${color.cyan(target)}: ${err.message}`)
    }
  }
  return
}

async function checkLinkToFilesystem(target: string, action: ActionArgs) {
  const unknownLink = new UnknownLink(decodeURI(target))
  const absoluteLink = unknownLink.absolutify(new AbsoluteFilePath(action.file), action.configuration.publications)
  const linkedFile = absoluteLink.localize(action.configuration.publications, action.configuration.defaultFile)
  const fullPath = path.join(action.configuration.sourceDir, linkedFile.platformified())

  // We only check for directories if no defaultFile is set.
  // Otherwise links to folders point to the default file.
  if (!action.configuration.defaultFile) {
    try {
      const stats = await fs.stat(fullPath)
      if (stats.isDirectory()) {
        action.name(`link to local directory ${color.cyan(linkedFile.platformified())}`)
        return
      }
    } catch (e) {
      // we can ignore errors here since we keep checking the file below
    }
  }

  action.name(`link to local file ${color.cyan(linkedFile.platformified())}`)
  try {
    await fs.stat(fullPath)
  } catch (err) {
    throw new Error(`link to non-existing local file ${color.bold(linkedFile.platformified())}`)
  }
}

async function checkLinkToAnchorInSameFile(containingFile: AbsoluteFilePath, target: string, action: ActionArgs) {
  const anchorName = target.substr(1)
  if (!action.linkTargets.hasAnchor(containingFile, anchorName)) {
    throw new Error(`link to non-existing local anchor ${color.bold(target)}`)
  }
  if (action.linkTargets.anchorType(containingFile, anchorName) === "heading") {
    action.name(`link to local heading ${color.cyan(target)}`)
  } else {
    action.name(`link to #${color.cyan(anchorName)}`)
  }
}

async function checkLinkToAnchorInOtherFile(containingFile: AbsoluteFilePath, target: string, action: ActionArgs) {
  const link = new UnknownLink(target)
  const absoluteLink = link.absolutify(containingFile, action.configuration.publications)
  const filePath = absoluteLink.localize(action.configuration.publications, action.configuration.defaultFile)
  const anchorName = absoluteLink.anchor()

  if (!action.linkTargets.hasFile(filePath)) {
    throw new Error(
      `link to anchor #${color.cyan(anchorName)} in non-existing file ${color.cyan(
        removeLeadingSlash(filePath.platformified())
      )}`
    )
  }

  if (!action.linkTargets.hasAnchor(filePath, anchorName)) {
    throw new Error(
      `link to non-existing anchor ${color.bold("#" + anchorName)} in ${color.bold(filePath.platformified())}`
    )
  }

  if (action.linkTargets.anchorType(filePath, anchorName) === "heading") {
    action.name(`link to heading ${color.cyan(filePath.platformified() + "#" + anchorName)}`)
  } else {
    action.name(`link to ${color.cyan(filePath.platformified())}#${color.cyan(anchorName)}`)
  }
}
