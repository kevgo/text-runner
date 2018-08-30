// @flow

const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')
const UnprintedUserError = require('../../../../errors/unprinted-user-error.js')

const pRegex = /<p([^>]*)>([\s\S]*)<\/p>/m

module.exports = async function transformPBlock (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(pRegex)
  if (!match) {
    throw new UnprintedUserError(
      'cannot match <p> tag',
      file.platformified(),
      line
    )
  }
  const resultNode = new AstNode({
    type: 'paragraph',
    tag: 'p',
    file,
    line,
    content: match[2],
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushNode(resultNode)
  return result
}
