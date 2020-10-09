import * as files from "../filesystem/index"
import * as helpers from "../helpers"

/**
 * Publications map local folders (in the source code) to public URL paths.
 * This is needed when verifying Markdown code that will be published as HTML somewhere,
 * and the links in Markdown reference the public URLs of the Markdown pages.
 */
export class Publication {
  /** filesystem path of the src folder */
  readonly localPath: string

  /** the corresponding URL path */
  readonly publicPath: string

  /** which extension the Markdown files have when served as HTML */
  readonly publicExtension: string

  constructor(localPath: string, publicPath: string, publicExtension: string) {
    this.localPath = helpers.addLeadingSlash(helpers.addTrailingSlash(localPath))
    this.publicPath = helpers.addLeadingSlash(publicPath)
    this.publicExtension = helpers.addLeadingDotUnlessEmpty(publicExtension)
  }

  /**
   * Returns the public link under which the given file path would be published
   * according to the rules of this publication
   */
  publish(localPath: files.FullPath): files.FullLink {
    const re = new RegExp("^" + this.localPath)
    const linkPath = helpers.addLeadingSlash(localPath.unixified()).replace(re, this.publicPath)
    const result = new files.FullLink(linkPath)
    if (this.publicExtension == null) {
      return result
    }
    return result.withExtension(this.publicExtension)
  }

  /** Returns whether this publication applies to the given file path */
  publishes(localPath: files.FullPath): boolean {
    return helpers.addLeadingSlash(helpers.addTrailingSlash(localPath.unixified())).startsWith(this.localPath)
  }

  /**
   * Returns the localPath for the given link
   * mapped according to the rules of this publication.
   */
  resolve(link: files.FullLink, defaultFile: string): files.FullPath {
    let result = link.rebase(this.publicPath, this.localPath)
    result = result.withoutAnchor()

    if (result.isLinkToDirectory()) {
      result = result.append(new files.RelativeLink(defaultFile))
    } else if (result.hasExtension(this.publicExtension)) {
      result = result.withExtension("md")
    }

    return new files.FullPath(result.value)
  }

  /** Returns whether this publication maps the given link */
  resolves(link: files.FullLink): boolean {
    return link.value.startsWith(this.publicPath)
  }
}
