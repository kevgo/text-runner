// @flow

// AbsoluteFilePath represents the full path
// to a markdown file on the local file system.
class AbsoluteFilePath {
  constructor(value: string) {
    this.value = value
  }

  // Returns the public link under which this file path is published
  publicLink(
    publications: Publications,
    defaultFile: DefaultFile
  ): AbsoluteLink {
    const publication = publications.forFilePath(this)
    if (publication == null) return this.unixified()

    // replace the directory with the one from the publication
    const pathRE = new RegExp('^' + this.value)
    const link = new AbsoluteLink(
      this.unixified().replace(pathRE, publication.publicPath)
    )
    return link.withExtension(publication.publicExtension)
  }

  // Returns this absolute path using forward slashes as path separators
  unixified(): string {
    return this.value.replace(/\\/g, '/')
  }
}
