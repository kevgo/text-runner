// @flow

const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')
const util = require('util')
const xml2js = require('xml2js')
const xml2jsp = util.promisify(xml2js.parseString)

const ulRegex = /<ul([^>]*)>[\s\S]*<\/ul>/m

module.exports = async function transformUl (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(ulRegex)
  const xml = await xml2jsp(node.content)
  const ulNode = new AstNode({
    type: 'bullet_list_open',
    tag: 'ul',
    file,
    line,
    content: '',
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushNode(ulNode)
  for (const li of xml.ul.li) {
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
    type: 'bullet_list_close',
    tag: '/ul',
    file,
    line,
    content: '',
    attributes: ulNode.attributes
  })
  return result
}
