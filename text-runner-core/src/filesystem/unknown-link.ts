import * as configuration from "../configuration/index"
import * as helpers from "../helpers"
import { FullLink } from "./full-link"
import { FullPath } from "./full-path"
import { RelativeLink } from "./relative-link"

/**
 * A link that isn't known yet whether it is relative or absolute
 */
export class UnknownLink {
  private readonly value: string

  constructor(publicPath: string) {
    this.value = helpers.removeDoubleSlash(helpers.unixify(publicPath))
  }

  absolutify(containingFile: FullPath, publications: configuration.Publications): FullLink {
    if (this.isAbsolute()) {
      return new FullLink(this.value)
    }
    return new RelativeLink(this.value).absolutify(containingFile, publications)
  }

  /**
   * Returns whether this link is an absolute link
   */
  isAbsolute(): boolean {
    return this.value.startsWith("/")
  }
}
