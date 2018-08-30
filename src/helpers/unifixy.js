// @flow

const re = /\\/g

// Converts the given Windows path into a Unix path
function unifixy (text: string): string {
  return text.replace(re, '/')
}

module.exports = unifixy
