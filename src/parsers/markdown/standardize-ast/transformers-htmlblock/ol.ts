import AbsoluteFilePath from '../../../../domain-model/absolute-file-path.js'
import AstNode from '../../../ast-node.js'
import AstNodeList from '../../../ast-node-list.js'
import parseHtmlAttributes from '../../helpers/parse-html-attributes.js'
import OpenTagTracker from '../../helpers/open-tag-tracker.js'
import util from 'util'
import xml2js from 'xml2js'

const xml2jsp = util.promisify(xml2js.parseString)

const olRegex = /<ol([^>]*)>[\s\S]*<\/ol>/m

module.exports = async function transformOl(
  node: any,
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
