import * as path from "path"

import * as files from "./index.js"

const sepRE = new RegExp("\\" + path.sep, "g")

/**
 * represents a full path to a file,
 * i.e. a path from the document base to a file.
 */
export class FullFilePath {
  private value: string

  constructor(value: string) {
    this.value = value.replace(sepRE, "/")
  }

  /** Returns the directory that contains this file */
  directory(): files.FullPath {
    return new files.FullPath(path.dirname(this.value) + "/")
  }

  /** Returns the file extension of this path */
  extName(): string {
    return path.extname(this.value)
  }

  /**
   * Returns the path in the platform-specific format,
   * i.e. using '\' on Windows and '/' everywhere else
   */
  platformified(): string {
    return this.value.replace(/\//g, path.sep)
  }

  toFullFilePath(): FullFilePath {
    return this
  }

  /** Returns this absolute path using forward slashes as path separators */
  unixified(): string {
    return this.value
  }
}
