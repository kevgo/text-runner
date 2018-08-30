// @flow

const replaceDoubleSlashRE = /\/\//g
const replaceDotRE = /\/\.\//
const replaceDotDotRE = /\/[^/]+\/\.\.\//

// Removes intermediate directory expressions from the given link
module.exports = function straightenLink (link: string): string {
  let result = link.replace(replaceDoubleSlashRE, '/')
  while (result.includes('/./')) {
    result = result.replace(replaceDotRE, '/')
  }
  while (result.includes('/../')) {
    result = result.replace(replaceDotDotRE, '/')
  }
  return result
}
