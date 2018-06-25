// @flow

import type { Publications } from '../configuration/configuration.js'

module.exports = function (publications: Publications): Publications {
  return publications.sort((a, b) => (a.publicPath > b.publicPath ? -1 : 1))
}
