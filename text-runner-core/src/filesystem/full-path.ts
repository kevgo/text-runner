import * as path from "path"

import * as configuration from "../configuration/index"
import * as helpers from "../helpers"
import { FullLink } from "./full-link"

/**
 * FullPath represents a complete path from the root directory of the document base
 * to a Markdown file on the local file system.
 */
export class FullPath {
  private readonly value: string

  constructor(value: string) {
    this.value = helpers.removeLeadingSlash(helpers.unixify(value))
  }

  /** Returns a new file path with the given file name appended to the end of this file path */
  append(fileName: string): FullPath {
    return new FullPath(path.join(this.platformified(), fileName))
  }

  /**
   * Returns the directory that contains this file path
   */
  directory(): FullPath {
    if (this.isDirectory()) {
      return this
    }
    return new FullPath(path.dirname(this.value) + "/")
  }

  /**
   * Returns the file extension of this path
   */
  extName(): string {
    return path.extname(this.value)
  }

  /**
   * Returns whether this file path points to a directory
   */
  isDirectory(): boolean {
    return this.value.endsWith("/")
  }

  /**
   * Returns the path in the platform-specific format,
   * i.e. using '\' on Windows and '/' everywhere else
   */
  platformified(): string {
    return this.value.replace(/\//g, path.sep)
  }

  /**
   * Returns this absolute path using forward slashes as path separators
   */
  unixified(): string {
    return this.value
  }

  /**
   * Returns the public link under which this file path is published
   * @param publications the publications of this session
   */
  publicPath(publications: configuration.Publications): FullLink {
    const publication = publications.forFilePath(this)
    if (publication == null) {
      return new FullLink(this.unixified())
    }
    return publication.publish(this)
  }
}
