// @flow

const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')
const util = require('util')
const xml2js = require('xml2js')
const xml2jsp = util.promisify(xml2js.parseString)

module.exports = async function transformUl (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const xml = await xml2jsp(node.content)
  const tableNode = new AstNode({
    type: 'table_open',
    tag: 'table',
    file,
    line,
    content: '',
    attributes: xml.table.$ || {}
  })
  result.pushData(tableNode)
  openTags.add(tableNode)
  if (xml.table.tr) parseRows(xml.table.tr, result, file, line)
  if (xml.table.thead) {
    result.pushData({
      type: 'thead_open',
      tag: 'thead',
      file,
      line,
      content: '',
      attributes: xml.table.thead.$ || {}
    })
    parseRows(xml.table.thead[0].tr, result, file, line)
    result.pushData({
      type: 'thead_close',
      tag: '/thead',
      file,
      line,
      content: '',
      attributes: xml.table.thead.$ || {}
    })
  }
  if (xml.table.tbody) {
    result.pushData({
      type: 'tbody_open',
      tag: 'tbody',
      file,
      line,
      content: '',
      attributes: xml.table.tbody.$ || {}
    })
    parseRows(xml.table.tbody[0].tr, result, file, line)
    result.pushData({
      type: 'tbody_close',
      tag: '/tbody',
      file,
      line,
      content: '',
      attributes: xml.table.tbody.$ || {}
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

function parseRows (
  block: Object,
  result: AstNodeList,
  file: string,
  line: number
) {
  for (const row of block) {
    result.pushData({
      type: 'table_row_open',
      tag: 'tr',
      file,
      line,
      content: row._ || '',
      attributes: row.$ || {}
    })

    for (const th of row.th || []) {
      result.pushData({
        type: 'table_heading',
        tag: 'th',
        file,
        line,
        content: th._ || th,
        attributes: th.$ || {}
      })
    }
    for (const td of row.td || []) {
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
      content: row._ || '',
      attributes: row.$ || {}
    })
  }
}
