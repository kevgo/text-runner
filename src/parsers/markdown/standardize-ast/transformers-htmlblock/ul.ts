import util from 'util'
import xml2js from 'xml2js'
import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import pretendToUse from '../../../../helpers/pretend-to-use'
import AstNode from '../../../ast-node'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'
import parseHtmlAttributes from '../../helpers/parse-html-attributes'

const xml2jsp = util.promisify(xml2js.parseString)

const ulRegex = /<ul([^>]*)>[\s\S]*<\/ul>/m

export default async function transformUl(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(ulRegex)
  const xml = await xml2jsp(node.content)
  const ulNode = new AstNode({
    attributes: parseHtmlAttributes(match[1]),
    content: '',
    file,
    line,
    tag: 'ul',
    type: 'bullet_list_open'
  })
  result.pushNode(ulNode)
  for (const li of xml.ul.li) {
    result.pushNode({
      attributes: li.$ || {},
      content: li._,
      file,
      line,
      tag: 'li',
      type: 'list_item_open'
    })
  }
  result.pushNode({
    attributes: ulNode.attributes,
    content: '',
    file,
    line,
    tag: '/ul',
    type: 'bullet_list_close'
  })
  pretendToUse(openTags)
  return result
}
