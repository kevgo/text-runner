// @flow

// trims the leading dollar from the given command
module.exports = function(text: string): string {
  return text.replace(/^\$?\s*/, '')
}
