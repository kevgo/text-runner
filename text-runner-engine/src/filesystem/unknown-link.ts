import * as configuration from "../configuration/index.js"
import * as helpers from "../helpers/index.js"
import * as files from "./index.js"

/**
 * A link that isn't known yet whether it is relative or absolute
 */
export class UnknownLink {
  private readonly value: string

  constructor(publicPath: string) {
    this.value = helpers.removeDoubleSlash(helpers.unixify(publicPath))
  }

  absolutify(containingLocation: files.Location, publications: configuration.Publications): files.FullLink {
    if (this.isAbsolute()) {
      return new files.FullLink(this.value)
    }
    return new files.RelativeLink(this.value).absolutify(containingLocation, publications)
  }

  /**
   * Returns whether this link is an absolute link
   */
  isAbsolute(): boolean {
    return this.value.startsWith("/")
  }
}
