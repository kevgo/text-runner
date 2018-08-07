// @flow

class Publications extends Array<Publication> {

  static scaffold(publicationsData: Object): Publications {
    const result = new Array<Publication>()
    for (const p of publicationsData) {
      result.push(new Publication(p.filePath, p.urlPath, p.urlExtension))
    }
    return result
  }

  // Returns the publication that matches the given filepath
  forFilePath(filePath: AbsoluteFilePath): ?Publication {
    return this.find(publication => this.isPublishedIn(publication))
  }

}

export type Publications
