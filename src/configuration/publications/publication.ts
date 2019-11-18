import { AbsoluteLink } from "../../filesystem/absolute-link"
import { RelativeLink } from "../../filesystem/relative-link"
import { addLeadingDotUnlessEmpty } from "../../helpers/add-leading-dot-unless-empty"
import { addLeadingSlash } from "../../helpers/add-leading-slash"
import { addTrailingSlash } from "../../helpers/add-trailing-slash"

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
    this.localPath = addLeadingSlash(addTrailingSlash(localPath))
    this.publicPath = addLeadingSlash(publicPath)
    this.publicExtension = addLeadingDotUnlessEmpty(publicExtension)
  }

  /**
   * Returns the public link under which the given file path would be published
   * according to the rules of this publication
   */
  publish(localPath: AbsoluteFilePath): AbsoluteLink {
    const re = new RegExp("^" + this.localPath)
    const linkPath = addLeadingSlash(localPath.unixified()).replace(re, this.publicPath)
    const result = new AbsoluteLink(linkPath)
    if (this.publicExtension == null) {
      return result
    }
    return result.withExtension(this.publicExtension)
  }

  /** Returns whether this publication applies to the given file path */
  publishes(localPath: AbsoluteFilePath): boolean {
    return addLeadingSlash(addTrailingSlash(localPath.unixified())).startsWith(this.localPath)
  }

  /**
   * Returns the localPath for the given link
   * mapped according to the rules of this publication.
   */
  resolve(link: AbsoluteLink, defaultFile: string): AbsoluteFilePath {
    let result = link.rebase(this.publicPath, this.localPath)
    result = result.withoutAnchor()

    if (result.isLinkToDirectory() && !result.hasAnchor()) {
      result = result.append(new RelativeLink(defaultFile))
    } else if (result.isLinkToDirectory() && result.hasAnchor()) {
      result = result
        .directory()
        .append(new RelativeLink(defaultFile))
        .withAnchor(result.anchor())
    } else if (result.hasExtension(this.publicExtension)) {
      result = result.withExtension("md")
    }

    return new AbsoluteFilePath(result.value)
  }

  /** Returns whether this publication maps the given link */
  resolves(link: AbsoluteLink): boolean {
    return link.value.startsWith(this.publicPath)
  }
}

import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
