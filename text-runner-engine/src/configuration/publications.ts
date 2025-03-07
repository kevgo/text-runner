import * as files from "../filesystem/index.js"
import { Publication, PublicationConfig } from "./publication.js"

export class Publications extends Array<Publication> {
  // Creates a new Publications instance based on the given JSON data
  static fromConfigs(configs: PublicationConfig[] = []): Publications {
    const result = new Publications()
    for (const config of configs) {
      result.push(new Publication(config))
    }
    return result
  }

  // Returns the publication that matches the given filepath
  forFilePath(filePath: files.FullPath): Publication | undefined {
    return this.find(publication => publication.publishes(filePath))
  }

  // Returns the publication that applies for the given link
  publicationForLink(link: files.FullLink): Publication | undefined {
    return this.find(publication => publication.resolves(link))
  }

  // Returns these publications, sorted by public path
  sorted(): Publications {
    const sorted = this.sort((a, b) => (a.publicPath > b.publicPath ? -1 : 1))
    return Publications.fromConfigs(sorted)
  }
}
