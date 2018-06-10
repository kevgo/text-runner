// @flow

const commentRE = /<!--.*-->/g
module.exports = function removeHtmlComments (html: string): string {
  return html.replace(commentRE, '').trim()
}
