// @flow

const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')
const util = require('util')
const xml2js = require('xml2js')
const xml2jsp = util.promisify(xml2js.parseString)

const olRegex = /<ol([^>]*)>[\s\S]*<\/ol>/m

module.exports = async function transformOl (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(olRegex)
  const xml = await xml2jsp(node.content)
  const olNode = new AstNode({
    type: 'ordered_list_open',
    tag: 'ol',
    file,
    line,
    content: '',
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushNode(olNode)
  for (const li of xml.ol.li) {
    result.pushNode({
      type: 'list_item_open',
      tag: 'li',
      file,
      line,
      content: li._,
      attributes: li.$ || {}
    })
  }
  result.pushNode({
    type: 'ordered_list_close',
    tag: '/ol',
    file,
    line,
    content: '',
    attributes: olNode.attributes
  })
  return result
}
