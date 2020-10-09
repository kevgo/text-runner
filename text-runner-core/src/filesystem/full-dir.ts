import * as path from "path"

/** represents the full path to a directory inside the document base, i.e. from the document root */
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
