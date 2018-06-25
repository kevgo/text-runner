// @flow

import type { Publications } from '../configuration/configuration.js'

const addLeadingDot = require('./add-leading-dot-unless-empty.js')
const addLeadingSlash = require('./add-leading-slash.js')
const addTrailingSlash = require('./add-trailing-slash.js')

module.exports = function (publications: any): Publications {
  if (!publications) return publications
  return publications.map(function (publication) {
    return {
      localPath: addLeadingSlash(addTrailingSlash(publication.localPath)),
      publicPath: addLeadingSlash(addTrailingSlash(publication.publicPath)),
      publicExtension:
        publication.publicExtension != null
          ? addLeadingDot(publication.publicExtension)
          : '.md'
    }
  })
}
