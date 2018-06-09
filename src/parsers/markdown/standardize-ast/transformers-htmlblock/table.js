// @flow

const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')
const util = require('util')
const xml2js = require('xml2js')
const xml2jsp = util.promisify(xml2js.parseString)

const tableRegex = /<table([^>]*)>[\s\S]*<\/table>/m

module.exports = async function transformUl (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(tableRegex)
  const xml = await xml2jsp(node.content)
  const tableNode = new AstNode({
    type: 'table_open',
    tag: 'table',
    file,
    line,
    content: '',
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushData(tableNode)
  openTags.add(tableNode)
  for (const tr of xml.table.tr) {
    result.pushData({
      type: 'table_row_open',
      tag: 'tr',
      file,
      line,
      content: tr._ || '',
      attributes: tr.$ || {}
    })
    for (const th of tr.th || []) {
      result.pushData({
        type: 'table_heading',
        tag: 'th',
        file,
        line,
        content: th._ || th,
        attributes: th.$ || {}
      })
    }
    for (const td of tr.td || []) {
      result.pushData({
        type: 'table_cell',
        tag: 'td',
        file,
        line,
        content: td._ || td,
        attributes: td.$ || {}
      })
    }
    result.pushData({
      type: 'table_row_close',
      tag: '/tr',
      file,
      line,
      content: tr._ || '',
      attributes: tr.$ || {}
    })
  }
  result.pushData({
    type: 'table_close',
    tag: '/table',
    file,
    line,
    content: '',
    attributes: tableNode.attributes
  })
  return result
}
