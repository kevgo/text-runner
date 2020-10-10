import { promises as fs } from "fs"
import got from "got"

import * as configuration from "../../configuration/index"
import * as files from "../../filesystem"
import * as actions from "../index"

/** The "checkImage" action checks for broken images. */
export async function checkImage(action: actions.Args): Promise<number | void> {
  const node = action.region[0]
  const imagePath = node.attributes.src
  if (!imagePath) {
    throw new Error("image tag without source")
  }
  action.name(`image ${imagePath}`)
  if (isRemoteImage(imagePath)) {
    const result = await checkRemoteImage(imagePath, action)
    return result
  } else {
    // local image here
    let imageFullFile: files.FullFile
    if (imagePath.startsWith("/")) {
      imageFullFile = new files.FullFile(imagePath)
    } else {
      imageFullFile = new files.FullFile(node.location.file.directory().joinStr(imagePath))
    }
    const result = await checkLocalImage(imageFullFile, action.configuration)
    return result
  }
}

async function checkLocalImage(image: files.FullFile, c: configuration.Data): Promise<void> {
  try {
    await fs.stat(c.sourceDir.joinFullFile(image).platformified())
  } catch (err) {
    throw new Error(`image ${image.unixified()} does not exist`)
  }
}

async function checkRemoteImage(url: string, action: actions.Args) {
  if (!action.configuration.online) {
    return action.SKIPPING
  }
  try {
    await got(url, { timeout: 2000 })
  } catch (err) {
    if (err instanceof got.HTTPError && err.response.statusCode === 404) {
      action.log(`image ${url} does not exist`)
    } else if (err instanceof got.TimeoutError) {
      action.log(`image ${url} timed out`)
    } else {
      throw err
    }
  }
  return
}

function isRemoteImage(imagePath: string): boolean {
  if (imagePath != null) {
    return imagePath.startsWith("//") || imagePath.startsWith("http://") || imagePath.startsWith("https://")
  } else {
    return false
  }
}
