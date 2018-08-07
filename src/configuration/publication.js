// @flow

// Defines the publication of a local file path to a public URL
class Publication {
  constructor(filePath: string, urlPath: string, urlExtension: string) {
    this.filePath = filePath
    this.urlPath = urlPath
    this.urlExtension = urlExtension
  }

  // Returns whether this publication applies to the given file path
  publishes(filePath: AbsoluteFilePath): boolean {
    return filePath.unixified().startsWith(this.filePath)
  }
}
