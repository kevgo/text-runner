import * as path from "path"

import * as configuration from "../configuration/index.js"
import * as helpers from "../helpers/index.js"
import * as files from "./index.js"

/**
 * represents a full path to either a file or a directory,
 * i.e. a link from the document base root to the object
 */
export class FullPath {
  private readonly value: string

  constructor(value: string) {
    this.value = helpers.removeLeadingSlash(helpers.unixify(value))
  }

  /** Returns a new file path with the given file name appended to the end of this file path */
  append(fileName: string): files.FullFilePath {
    return new files.FullFilePath(path.join(this.platformified(), fileName))
  }

  /** Returns the directory that contains this file path */
  directory(): FullPath {
    if (this.isDirectory()) {
      return this
    }
    return new FullPath(path.dirname(this.value) + "/")
  }

  /** Returns the file extension of this path */
  extName(): string {
    return path.extname(this.value)
  }

  /** Returns whether this file path points to a directory */
  isDirectory(): boolean {
    return this.value.endsWith("/")
  }

  joinStr(relPath: string): string {
    return path.join(this.value, relPath)
  }

  /**
   * Returns the path in the platform-specific format,
   * i.e. using '\' on Windows and '/' everywhere else
   */
  platformified(): string {
    return this.value.replace(/\//g, path.sep)
  }

  /** Returns the public link under which this file path is published */
  publicPath(publications: configuration.Publications): files.FullLink {
    const publication = publications.forFilePath(this)
    if (publication == null) {
      return new files.FullLink(this.unixified())
    }
    return publication.publish(this)
  }

  /** provides the FullFilePath if this path points to a file */
  toFullFilePath(): files.FullFilePath {
    if (this.isDirectory()) {
      throw new Error(`FullPath '${this.unixified()}' does tot point to a file`)
    }
    return new files.FullFilePath(this.value)
  }

  /** Returns this absolute path using forward slashes as path separators */
  unixified(): string {
    return this.value
  }
}
