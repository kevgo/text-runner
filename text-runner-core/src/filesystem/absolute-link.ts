import * as path from "path"

import * as configuration from "../configuration/index"
import * as helpers from "../helpers"
import { FullPath } from "./full-path"
import { RelativeLink } from "./relative-link"

/**
 * Represents a link to another Markdown file,
 * all the way from the root directory
 * (i.e. a link starting with '/')
 */
export class AbsoluteLink {
  readonly value: string

  constructor(publicPath: string) {
    this.value = helpers.addLeadingSlash(helpers.removeDoubleSlash(helpers.unixify(publicPath)))
  }

  /**
   * Returns the anchor part of this link
   */
  anchor(): string {
    return this.value.split("#")[1] || ""
  }

  /**
   * Returns a new link that consists of this link
   * with the given relative link appended
   */
  append(segment: RelativeLink): AbsoluteLink {
    return new AbsoluteLink(helpers.straightenLink(this.value + "/" + segment.value))
  }

  /**
   * Returns a link to the containing directory
   */
  directory(): AbsoluteLink {
    const withoutAnchor = this.withoutAnchor()
    if (withoutAnchor.isLinkToDirectory()) {
      return withoutAnchor
    }
    return new AbsoluteLink(withoutAnchor.value.substr(0, withoutAnchor.value.lastIndexOf("/") + 1))
  }

  hasAnchor(): boolean {
    return this.anchor() !== ""
  }

  /**
   * Returns whether this link has the given extension
   */
  hasExtension(extension: string): boolean {
    return path.extname(this.value) === helpers.addLeadingDotUnlessEmpty(extension)
  }

  /**
   * Returns whether this link points to a directory
   */
  isLinkToDirectory(): boolean {
    return this.value.endsWith("/")
  }

  /**
   * Returns the file path that this link has on the local filesystem
   * @param publications the publications of this TextRunner session
   * @param defaultFile the filename to use in case this link points to a directory
   */
  localize(publications: configuration.Publications, defaultFile: string): FullPath {
    const publication = publications.publicationForLink(this)
    let result = publication
      ? publication.resolve(this.urlDecoded(), defaultFile)
      : new FullPath(this.urlDecoded().withoutAnchor().value)

    // append the default file
    if (result.extName() === "" && defaultFile) {
      result = result.append(defaultFile)
    }
    return result
  }

  /**
   * Returns a link where the old enclosing directory is replaced
   * with the new enclosing directory
   */
  rebase(oldPath: string, newPath: string): AbsoluteLink {
    const re = new RegExp("^" + oldPath)
    return new AbsoluteLink(this.value.replace(re, newPath))
  }

  urlDecoded(): AbsoluteLink {
    return new AbsoluteLink(decodeURI(this.value))
  }

  /**
   * Returns a link that contains the given anchor
   */
  withAnchor(anchor: string): AbsoluteLink {
    return new AbsoluteLink(this.withoutAnchor().value + "#" + anchor)
  }

  /**
   * Returns another AbsoluteLink instance that uses the given file extension
   */
  withExtension(newExtension: string): AbsoluteLink {
    const extRE = new RegExp(path.extname(this.value) + "$")
    return new AbsoluteLink(this.value.replace(extRE, helpers.addLeadingDotUnlessEmpty(newExtension)))
  }

  /**
   * Returns a link that is this link without the anchor
   */
  withoutAnchor(): AbsoluteLink {
    return new AbsoluteLink(this.value.split("#")[0])
  }
}
