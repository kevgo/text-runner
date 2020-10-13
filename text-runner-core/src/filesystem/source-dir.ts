import * as glob from "glob-promise"
import * as path from "path"

import * as files from "."

/** represents the document base directory */
export class SourceDir {
  value: string

  constructor(value: string) {
    this.value = value
  }

  async fullFilesMatchingGlob(expression: string): Promise<files.FullFilePath[]> {
    const allFiles = await glob(expression)
    return allFiles.sort().map(file => new files.AbsoluteFilePath(file).toFullFile(this))
  }

  joinFullDir(dir: files.FullDir): files.AbsoluteDirPath {
    return new files.AbsoluteDirPath(path.join(this.platformified(), dir.platformified()))
  }

  joinFullFile(file: files.FullFilePath): files.AbsoluteFilePath {
    return new files.AbsoluteFilePath(path.join(this.platformified(), file.platformified()))
  }

  /** provides a path of this directory with the given path appended */
  joinStr(...paths: string[]): string {
    return path.join(this.platformified(), ...paths)
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
