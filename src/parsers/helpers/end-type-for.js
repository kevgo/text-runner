// @flow

// Returns the node type closing the given node type
module.exports = function endTypeFor (nodeType: string): string {
  return nodeType.replace('open', '') + 'close'
}
