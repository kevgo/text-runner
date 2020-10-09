import * as path from "path"

import * as files from "."

/** represents a full path to a directory inside the document */
export class FullDir {
  value: string

  constructor(value: string) {
    this.value = value
  }

  /** Returns a new file path with the given file name appended to the end of this file path */
  joinStr(fileName: string): files.FullFile {
    return new files.FullFile(path.join(this.platformified(), fileName))
  }

  /**
   * Returns the path in the platform-specific format,
   * i.e. using '\' on Windows and '/' everywhere else
   */
  platformified(): string {
    return this.value.replace(/\//g, path.sep)
  }

  /** Returns this absolute path using forward slashes as path separators */
  unixified(): string {
    return this.value
  }
}
