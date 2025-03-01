import * as files from "../filesystem/index.js"
import * as helpers from "../helpers/index.js"

export interface PublicationConfig {
  /** filesystem path of the src folder */
  localPath: string

  /** which extension the Markdown files have when served as HTML */
  publicExtension: string

  /** the corresponding URL path */
  publicPath: string
}

/**
 * Publications map local folders (in the source code) to public URL paths.
 * This is needed when verifying Markdown code that will be published as HTML somewhere,
 * and the links in Markdown reference the public URLs of the Markdown pages.
 */
export class Publication implements PublicationConfig {
  /** filesystem path of the src folder */
  readonly localPath: string

  /** which extension the Markdown files have when served as HTML */
  readonly publicExtension: string

  /** the corresponding URL path */
  readonly publicPath: string

  constructor(args: { localPath: string; publicExtension: string; publicPath: string }) {
    this.localPath = helpers.addLeadingSlash(helpers.addTrailingSlash(args.localPath))
    this.publicPath = helpers.addLeadingSlash(args.publicPath)
    this.publicExtension = helpers.addLeadingDotUnlessEmpty(args.publicExtension)
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

  /** indicates whether this publication applies to the given file path */
  publishes(localPath: files.FullPath): boolean {
    return helpers.addLeadingSlash(helpers.addTrailingSlash(localPath.unixified())).startsWith(this.localPath)
  }

  /**
   * provides the localPath for the given link
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

  /** indicates whether this publication maps the given link */
  resolves(link: files.FullLink): boolean {
    return link.value.startsWith(this.publicPath)
  }
}
