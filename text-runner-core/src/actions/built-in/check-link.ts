import { promises as fs } from "fs"
import got from "got"
import * as path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { UnknownLink } from "../../filesystem/unknown-link"
import * as helpers from "../../helpers"
import { ActionArgs } from "../index"

/** The "checkLink" action checks for broken hyperlinks. */
export async function checkLink(action: ActionArgs): Promise<number | void> {
  const target = action.region.getNodeOfTypes("link_open").attributes.href
  if (target == null || target === "") {
    throw new Error("link without target")
  }

  action.name(`link to ${target}`)
  const filePath = new AbsoluteFilePath(action.file)

  if (helpers.isMailtoLink(target)) {
    return action.SKIPPING
  }

  if (helpers.isLinkToAnchorInSameFile(target)) {
    const result = await checkLinkToAnchorInSameFile(filePath, target, action)
    return result
  }

  if (helpers.isLinkToAnchorInOtherFile(target)) {
    const result = await checkLinkToAnchorInOtherFile(filePath, target, action)
    return result
  }

  if (helpers.isExternalLink(target)) {
    const result = await checkExternalLink(target, action)
    return result
  }

  await checkLinkToFilesystem(target, action)
  return
}

async function checkExternalLink(target: string, action: ActionArgs) {
  if (!action.configuration.online) {
    return action.SKIPPING
  }

  try {
    action.name(`link to external website ${target}`)
    await got(target, { timeout: 4000 })
  } catch (err) {
    if (err.statusCode === 404 || err.code === "ENOTFOUND") {
      action.log("external website doesn't exist")
    } else if (err instanceof got.TimeoutError) {
      action.log("timed out")
    } else {
      action.log(`error while checking link to ${target}: ${err.message}`)
    }
  }
  return
}

async function checkLinkToFilesystem(target: string, action: ActionArgs) {
  const unknownLink = new UnknownLink(decodeURI(target))
  const absoluteLink = unknownLink.absolutify(new AbsoluteFilePath(action.file), action.configuration.publications)
  const linkedFile = absoluteLink.localize(action.configuration.publications, action.configuration.defaultFile)
  const fullPath = path.join(action.configuration.sourceDir, linkedFile.unixified())

  // We only check for directories if no defaultFile is set.
  // Otherwise links to folders point to the default file.
  if (!action.configuration.defaultFile) {
    try {
      const stats = await fs.stat(fullPath)
      if (stats.isDirectory()) {
        action.name(`link to local directory ${linkedFile.unixified()}`)
        return
      }
    } catch (e) {
      // we can ignore errors here since we keep checking the file below
    }
  }

  action.name(`link to local file ${linkedFile.unixified()}`)
  try {
    await fs.stat(fullPath)
  } catch (err) {
    throw new Error(`link to non-existing local file ${linkedFile.unixified()}`)
  }
}

async function checkLinkToAnchorInSameFile(containingFile: AbsoluteFilePath, target: string, action: ActionArgs) {
  const anchorName = target.substr(1)
  if (!action.linkTargets.hasAnchor(containingFile, anchorName)) {
    throw new Error(`link to non-existing local anchor ${target}`)
  }
  if (action.linkTargets.anchorType(containingFile, anchorName) === "heading") {
    action.name(`link to local heading ${target}`)
  } else {
    action.name(`link to #${anchorName}`)
  }
}

async function checkLinkToAnchorInOtherFile(containingFile: AbsoluteFilePath, target: string, action: ActionArgs) {
  const link = new UnknownLink(target)
  const absoluteLink = link.absolutify(containingFile, action.configuration.publications)
  const filePath = absoluteLink.localize(action.configuration.publications, action.configuration.defaultFile)
  const anchorName = absoluteLink.anchor()

  if (!action.linkTargets.hasFile(filePath)) {
    throw new Error(
      `link to anchor #${anchorName} in non-existing file ${helpers.removeLeadingSlash(filePath.unixified())}`
    )
  }

  if (!action.linkTargets.hasAnchor(filePath, anchorName)) {
    throw new Error(`link to non-existing anchor ${"#" + anchorName} in ${filePath.unixified()}`)
  }

  if (action.linkTargets.anchorType(filePath, anchorName) === "heading") {
    action.name(`link to heading ${filePath.unixified() + "#" + anchorName}`)
  } else {
    action.name(`link to ${filePath.unixified()}#${anchorName}`)
  }
}
