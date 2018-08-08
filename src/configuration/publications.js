// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const Publication = require('./publication.js')

class Publications extends Array<Publication> {
  // Creates a new Publications instance based on the given JSON data
  static fromJSON (publicationsData: Array<Object>): Publications {
    const result = new Publications()
    for (const p of publicationsData) {
      result.push(new Publication(p.filePath, p.urlPath, p.urlExtension))
    }
    return result
  }

  // Returns the publication that matches the given filepath
  forFilePath (filePath: AbsoluteFilePath): ?Publication {
    return this.find(publication => publication.publishes(filePath))
  }
}

module.exports = Publications
