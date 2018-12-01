import { Configuration } from '../configuration/configuration'
import { ActionArgs } from '../runners/action-args'

import chalk from 'chalk'
import fs from 'fs-extra'
import got from 'got'
import path from 'path'
import Formatter from '../formatters/formatter'

// Checks for broken hyperlinks
export default (async function(args: ActionArgs) {
  const node = args.nodes[0]
  let imagePath = node.attributes ? node.attributes.src : null
  if (!imagePath) {
    throw new Error('image tag without source')
  }
  args.formatter.name(`image ${chalk.cyan(imagePath)}`)
  if (isRemoteImage(imagePath)) {
    await checkRemoteImage(imagePath, args.formatter, args.configuration)
  } else {
    if (!imagePath.startsWith('/')) {
      imagePath = path.join(path.dirname(node.file.platformified()), imagePath)
    }
    await checkLocalImage(imagePath, args.configuration)
  }
})

async function checkLocalImage(imagePath: string, c: Configuration) {
  try {
    await fs.stat(path.join(c.sourceDir, imagePath))
  } catch (err) {
    throw new Error(`image ${chalk.red(imagePath)} does not exist`)
  }
}

async function checkRemoteImage(url: string, f: Formatter, c: Configuration) {
  if (c.offline) {
    f.skip(`skipping external image: ${chalk.magenta(url)}`)
    return
  }
  try {
    await got(url, { timeout: 2000 })
  } catch (err) {
    if (err.statusCode === 404) {
      f.warning(`image ${chalk.magenta(url)} does not exist`)
    } else if (err instanceof got.TimeoutError) {
      f.warning(`image ${chalk.magenta(url)} timed out`)
    } else {
      throw err
    }
  }
}

function isRemoteImage(imagePath: string): boolean {
  if (imagePath != null) {
    return (
      imagePath.startsWith('//') ||
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://')
    )
  } else {
    return false
  }
}
