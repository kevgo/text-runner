import color from "colorette"
import fs from "fs-extra"
import got from "got"
import path from "path"
import { Configuration } from "../../configuration/types/configuration"
import { ActionArgs } from "../types/action-args"

/** The "checkImage" action checks for broken images. */
export default async function checkImage(args: ActionArgs) {
  const node = args.nodes[0]
  let imagePath = node.attributes ? node.attributes.src : null
  if (!imagePath) {
    throw new Error("image tag without source")
  }
  args.name(`image ${color.cyan(imagePath)}`)
  if (isRemoteImage(imagePath)) {
    const result = await checkRemoteImage(imagePath, args)
    return result
  } else {
    if (!imagePath.startsWith("/")) {
      imagePath = path.join(path.dirname(node.file.platformified()), imagePath)
    }
    const result = await checkLocalImage(imagePath, args.configuration)
    return result
  }
}

async function checkLocalImage(imagePath: string, c: Configuration) {
  try {
    await fs.stat(path.join(c.sourceDir, imagePath))
  } catch (err) {
    throw new Error(`image ${color.red(imagePath)} does not exist`)
  }
}

async function checkRemoteImage(url: string, args: ActionArgs) {
  if (args.configuration.offline) {
    return args.SKIPPING
  }
  try {
    await got(url, { timeout: 2000 })
  } catch (err) {
    if (err instanceof got.HTTPError && err.response.statusCode === 404) {
      args.log(`image ${color.magenta(url)} does not exist`)
    } else if (err instanceof got.TimeoutError) {
      args.log(`image ${color.magenta(url)} timed out`)
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