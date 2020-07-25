import { Publications } from "../configuration/publications/publications"
import { AbsoluteFilePath } from "./absolute-file-path"
import { AbsoluteLink } from "./absolute-link"
import { removeDoubleSlash } from "./helpers/remove-double-slash"
import { unixify } from "./helpers/unixify"
import { RelativeLink } from "./relative-link"

/**
 * A link that isn't known yet whether it is relative or absolute
 */
export class UnknownLink {
  private readonly value: string

  constructor(publicPath: string) {
    this.value = removeDoubleSlash(unixify(publicPath))
  }

  absolutify(containingFile: AbsoluteFilePath, publications: Publications): AbsoluteLink {
    if (this.isAbsolute()) {
      return new AbsoluteLink(this.value)
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
