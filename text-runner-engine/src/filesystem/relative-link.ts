import * as configuration from "../configuration/index.js"
import * as files from "./index.js"

/**
 * A link relative to the current location,
 * i.e. a link not starting with '/'
 */
export class RelativeLink {
  readonly value: string

  constructor(publicPath: string) {
    this.value = publicPath
  }

  /**
   * Assuming this relative link is in the given file,
   * returns the absolute links that point to the same target as this relative link.
   */
  absolutify(containingLocation: files.Location, publications: configuration.Publications): files.FullLink {
    const urlOfDir = containingLocation.file.directory().publicPath(publications)
    return urlOfDir.append(this)
  }
}
