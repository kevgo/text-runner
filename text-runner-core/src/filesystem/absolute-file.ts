import * as path from "path"

import * as files from "."

/** represents an absolute path to a file, i.e. from filesystem root to the file */
export class AbsoluteFile {
  value: string

  constructor(value: string) {
    this.value = value
  }

  /** provides the directory that contains this file path */
  directory(): files.AbsoluteDir {
    return new files.AbsoluteDir(path.dirname(this.value) + "/")
  }

  /**
   * Returns the path in the platform-specific format,
   * i.e. using '\' on Windows and '/' everywhere else
   */
  platformified(): string {
    return this.value.replace(/\//g, path.sep)
  }

  /** provides the relative path from the given directory to this file */
  toFullFile(sourceDir: string): files.FullFile {
    return new files.FullFile(path.relative(sourceDir, this.platformified()))
  }

  /**
   * Returns this absolute path using forward slashes as path separators
   */
  unixified(): string {
    return this.value
  }
}
