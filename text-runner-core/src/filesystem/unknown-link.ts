import * as configuration from "../configuration/index"
import * as helpers from "../helpers"
import * as files from "./index"

/**
 * A link that isn't known yet whether it is relative or absolute
 */
export class UnknownLink {
  private readonly value: string

  constructor(publicPath: string) {
    this.value = helpers.removeDoubleSlash(helpers.unixify(publicPath))
  }

  absolutify(containingFile: files.FullFile, publications: configuration.Publications): files.FullLink {
    if (this.isAbsolute()) {
      return new files.FullLink(this.value)
    }
    return new files.RelativeLink(this.value).absolutify(containingFile, publications)
  }

  /**
   * Returns whether this link is an absolute link
   */
  isAbsolute(): boolean {
    return this.value.startsWith("/")
  }
}
