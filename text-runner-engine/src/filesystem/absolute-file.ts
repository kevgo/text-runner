import * as path from "path"

import * as files from "./index.js"

/** represents an absolute path to a file, i.e. from filesystem root to the file */
export class AbsoluteFilePath {
  value: string

  constructor(value: string) {
    this.value = value
  }

  /** provides the directory that contains this file */
  directory(): files.AbsoluteDirPath {
    return new files.AbsoluteDirPath(path.dirname(this.value) + "/")
  }

  /**
   * provides this file path with platform specific path separators,
   * i.e. '\' on Windows and '/' everywhere else
   */
  platformified(): string {
    return this.value.replace(/\//g, path.sep)
  }

  /** provides the relative path from the given directory to this file */
  toFullFile(sourceDir: files.SourceDir): files.FullFilePath {
    return new files.FullFilePath(path.relative(sourceDir.platformified(), this.platformified()))
  }

  /** provides this file path with forward slashes as path separators */
  unixified(): string {
    return this.value
  }
}
