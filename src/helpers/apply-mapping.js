// @flow

import type { Mapping } from '../configuration/configuration.js'

module.exports = function (path: string, mappings: Array<Mapping>): string {
  for (const mapping of mappings) {
    const regex = new RegExp(`^${mapping[1]}`)
    const match = path.match(regex)
    if (match) return path.replace(mapping[1], mapping[0])
  }
  return path
}
