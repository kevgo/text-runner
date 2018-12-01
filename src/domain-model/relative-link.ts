import Publications from '../configuration/publications'
import AbsoluteFilePath from './absolute-file-path'
import AbsoluteLink from './absolute-link'

// A link relative to the current location,
// i.e. a link not starting with '/'
export default class RelativeLink {
  value: string

  constructor(publicPath: string) {
    this.value = publicPath
  }

  // Assuming this relative link is in the given file,
  // returns the absolute links that point to the same target as this relative link.
  absolutify(
    containingFile: AbsoluteFilePath,
    publications: Publications
  ): AbsoluteLink {
    const urlOfDir = containingFile.directory().publicPath(publications)
    return urlOfDir.append(this)
  }
}
