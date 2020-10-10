import * as path from "path"

import * as configuration from "../configuration/index"
import * as files from "."

/** represents the full path to a directory inside the document base, i.e. from the document root */
export class FullDir {
  value: string

  constructor(value: string) {
    this.value = value
  }

  joinStr(relFile: string): files.FullFile {
    return new files.FullFile(path.join(this.value, relFile))
  }

  /** Returns the public link under which this file path is published */
  publicPath(publications: configuration.Publications): files.FullLink {
    const publication = publications.forFilePath(this)
    if (publication == null) {
      return new files.FullLink(this.unixified())
    }
    return publication.publish(this)
  }

  /**
   * Returns the path in the platform-specific format,
   * i.e. using '\' on Windows and '/' everywhere else
   */
  platformified(): string {
    return this.value.replace(/\//g, path.sep)
  }
}
