import * as configuration from "../configuration/index"
import { FullLink } from "./full-link"
import { FullPath } from "./full-path"

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
   *
   * @param containingFile
   * @param publications the publications of this TextRunner session
   */
  absolutify(containingFile: FullPath, publications: configuration.Publications): FullLink {
    const urlOfDir = containingFile.directory().publicPath(publications)
    return urlOfDir.append(this)
  }
}
