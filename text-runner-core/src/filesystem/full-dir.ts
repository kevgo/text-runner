import * as path from "path"

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
