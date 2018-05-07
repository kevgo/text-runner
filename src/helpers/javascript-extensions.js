// @flow

const interpret = require('interpret')

// Returns all possible filename extensions that handler functions can have
module.exports = function javascriptExtensions (): string[] {
  return Object.keys(interpret.jsVariants).map(it => it.slice(1))
}
