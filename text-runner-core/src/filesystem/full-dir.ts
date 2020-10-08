import * as path from "path"

/**
 * represents a full directory path,
 * i.e. path from document base root to the directory
 */
export class FullDir {
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
