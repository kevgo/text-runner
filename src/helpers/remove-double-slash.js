// @flow

const doubleSlashRE = /\/+/g

// Replaces multiple occurrences of '/' with a single slash
function removeDoubleSlash (text: string): string {
  return text.replace(doubleSlashRE, '/')
}

module.exports = removeDoubleSlash
