import * as path from "path"

/**
 * represents an absolute path to a directory,
 * i.e. path from filesystem root to the directory
 */
export class AbsoluteDir {
  value: string

  constructor(value: string) {
    this.value = value
  }

  /**
   * Returns the path in the platform-specific format,
   * i.e. using '\' on Windows and '/' everywhere else
   */
  platformified(): string {
    return this.value.replace(/\//g, path.sep)
  }
}
