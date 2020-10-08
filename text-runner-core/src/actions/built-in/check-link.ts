import { promises as fs } from "fs"
import got from "got"
import * as path from "path"

import * as files from "../../filesystem/"
import * as helpers from "../../helpers"
import { Args } from "../index"

/** The "checkLink" action checks for broken hyperlinks. */
export async function checkLink(action: Args): Promise<Args["SKIPPING"] | void> {
  const target = action.region.getNodeOfTypes("link_open").attributes.href
  if (target == null || target === "") {
    throw new Error("link without target")
  }

  action.name(`link to ${target}`)

  if (helpers.isMailtoLink(target)) {
    return action.SKIPPING
  }

  if (helpers.isLinkToAnchorInSameFile(target)) {
    const result = checkLinkToAnchorInSameFile(action.file, target, action)
    return result
  }

  if (helpers.isLinkToAnchorInOtherFile(target)) {
    const result = checkLinkToAnchorInOtherFile(action.file, target, action)
    return result
  }

  if (helpers.isExternalLink(target)) {
    const result = await checkExternalLink(target, action)
    return result
  }

  await checkLinkToFilesystem(target, action)
  return
}

async function checkExternalLink(target: string, action: Args) {
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

async function checkLinkToFilesystem(target: string, action: Args) {
  const unknownLink = new files.UnknownLink(decodeURI(target))
  const absoluteLink = unknownLink.absolutify(action.file, action.configuration.publications)
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

function checkLinkToAnchorInSameFile(containingFile: files.FullFile, target: string, action: Args) {
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

function checkLinkToAnchorInOtherFile(containingFile: files.FullFile, target: string, action: Args) {
  const link = new files.UnknownLink(target)
  const absoluteLink = link.absolutify(containingFile, action.configuration.publications)
  const anchorName = absoluteLink.anchor()
  const fullPath = absoluteLink.localize(action.configuration.publications, action.configuration.defaultFile)
  let fullFile: files.FullFile
  try {
    fullFile = fullPath.toFullFile()
  } catch (e) {
    throw new Error(`link to non-existing file ${fullPath.unixified()}`)
  }

  if (!action.linkTargets.hasFile(fullFile)) {
    throw new Error(
      `link to anchor #${anchorName} in non-existing file ${helpers.removeLeadingSlash(fullFile.unixified())}`
    )
  }

  if (!action.linkTargets.hasAnchor(fullFile, anchorName)) {
    throw new Error(`link to non-existing anchor ${"#" + anchorName} in ${fullFile.unixified()}`)
  }

  if (action.linkTargets.anchorType(fullFile, anchorName) === "heading") {
    action.name(`link to heading ${fullFile.unixified() + "#" + anchorName}`)
  } else {
    action.name(`link to ${fullFile.unixified()}#${anchorName}`)
  }
}
