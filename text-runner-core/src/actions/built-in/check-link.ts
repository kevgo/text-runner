import { promises as fs } from "fs"
import got from "got"

import { UserError } from "../../errors/user-error"
import * as files from "../../filesystem/"
import * as helpers from "../../helpers"
import { Args } from "../index"

/** The "checkLink" action checks for broken hyperlinks. */
export async function checkLink(action: Args): Promise<Args["SKIPPING"] | void> {
  const target = action.region.nodeOfTypes("link_open").attributes.href
  if (target == null || target === "") {
    throw new Error("link without target")
  }

  for (const ignoreLinkTarget of action.configuration.ignoreLinkTargets) {
    if (ignoreLinkTarget.test(target)) {
      return action.SKIPPING
    }
  }

  action.name(`link to ${target}`)

  if (helpers.isMailtoLink(target)) {
    return action.SKIPPING
  }

  if (helpers.isLinkToAnchorInSameFile(target)) {
    const result = checkLinkToAnchorInSameFile(action.location.file, target, action)
    return result
  }

  if (helpers.isLinkToAnchorInOtherFile(target)) {
    const result = checkLinkToAnchorInOtherFile(action.location, target, action)
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
  action.name(`link to external website ${target}`)
  try {
    await got(target, { timeout: 2000 })
  } catch (e) {
    if (e instanceof got.HTTPError && e.response.statusCode === 404) {
      throw new Error(`external website doesn't exist: ${target}`)
    } else if (e instanceof got.TimeoutError) {
      action.log("timed out")
    } else if (e instanceof Error) {
      action.log(`error while checking link to ${target}: ${e.message}`)
    } else {
      throw e
    }
  }
  return
}

async function checkLinkToFilesystem(target: string, action: Args) {
  const unknownLink = new files.UnknownLink(decodeURI(target))
  const absoluteLink = unknownLink.absolutify(action.location, action.configuration.publications)
  const linkedFile = absoluteLink.localize(action.configuration.publications, action.configuration.defaultFile)
  const fullPath = action.configuration.sourceDir.joinStr(linkedFile.unixified())

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

function checkLinkToAnchorInSameFile(file: files.FullFilePath, target: string, action: Args) {
  const anchorName = target.substr(1)
  if (!action.linkTargets.hasAnchor(file, anchorName)) {
    throw new UserError(
      `link to non-existing local anchor ${target}`,
      `These local anchors exist: ${action.linkTargets
        .getAnchors(file)
        .map(anchor => `#${anchor}`)
        .join(", ")}`,
      action.location
    )
  }
  if (action.linkTargets.anchorType(file, anchorName) === "heading") {
    action.name(`link to local heading ${target}`)
  } else {
    action.name(`link to #${anchorName}`)
  }
}

function checkLinkToAnchorInOtherFile(containingLocation: files.Location, target: string, action: Args) {
  const link = new files.UnknownLink(target)
  const absoluteLink = link.absolutify(containingLocation, action.configuration.publications)
  const anchorName = absoluteLink.anchor()
  const fullPath = absoluteLink.localize(action.configuration.publications, action.configuration.defaultFile)
  try {
    var fullFile = fullPath.toFullFilePath()
  } catch (e) {
    throw new Error(`link to non-existing file ${fullPath.unixified()}`)
  }

  if (!action.linkTargets.hasFile(fullFile)) {
    throw new Error(
      `link to anchor #${anchorName} in non-existing file ${helpers.removeLeadingSlash(fullFile.unixified())}`
    )
  }

  if (!action.linkTargets.hasAnchor(fullFile, anchorName)) {
    throw new UserError(
      `link to non-existing anchor ${"#" + anchorName} in ${fullFile.unixified()}`,
      `File ${fullFile.unixified()} contains these anchors: ${action.linkTargets
        .getAnchors(fullFile)
        .map(anchor => `#${anchor}`)
        .join(", ")}`
    )
  }

  if (action.linkTargets.anchorType(fullFile, anchorName) === "heading") {
    action.name(`link to heading ${fullFile.unixified() + "#" + anchorName}`)
  } else {
    action.name(`link to ${fullFile.unixified()}#${anchorName}`)
  }
}
