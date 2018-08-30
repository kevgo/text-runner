// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const AbsoluteLink = require('../domain-model/absolute-link.js')
const Publication = require('./publication.js')

class Publications extends Array<Publication> {
  // Creates a new Publications instance based on the given JSON data
  static fromJSON (publicationsData: Array<Object>): Publications {
    const result = new Publications()
    for (const p of publicationsData) {
      result.push(new Publication(p.localPath, p.publicPath, p.publicExtension))
    }
    return result
  }

  // Returns the publication that matches the given filepath
  forFilePath (filePath: AbsoluteFilePath): ?Publication {
    return this.find(publication => publication.publishes(filePath))
  }

  // Returns the publication that applies for the given link
  publicationForLink (link: AbsoluteLink): ?Publication {
    return this.find(publication => publication.resolves(link))
  }

  // Returns these publications, sorted by public path
  sorted (): Publications {
    const sorted = this.sort((a, b) => (a.publicPath > b.publicPath ? -1 : 1))
    return Publications.fromJSON(sorted)
  }
}

module.exports = Publications
