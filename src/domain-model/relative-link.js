// @flow

// A link relative to the current location,
// i.e. a link not starting with '/'
class RelativeLink {
  constructor(urlPath: string) {
    this.value = urlPath
  }

  toAbsoluteLink(
    containingFilePath: AbsoluteFilePath,
    publications: Publications,
    defaultFile: DefaultFile
  ): AbsoluteLink {
    // calculate the UrlPath of the directory that the link originates from
    const urlOfDir = path.dirname(
      localToPublicFilePath(
        addLeadingSlash(containingFilePath),
        publications,
        defaultFile
      )
    )

    // concatenate the link
    const full = urlOfDir + '/' + link

    // normalize
    const dried = full.replace(/\/+/g, '/').replace(/\\+/g, '\\')
    const normalized = path.normalize(dried)
    return unixifyPath(normalized)
  }
}
