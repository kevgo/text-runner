// @flow

const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')
const UnprintedUserError = require('../../../../errors/unprinted-user-error.js')
const util = require('util')
const xml2js = require('xml2js')
const xml2jsp = util.promisify(xml2js.parseString)

module.exports = async function transformTable (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  var xml = {}
  try {
    xml = await xml2jsp(node.content)
  } catch (e) {
    const lineMatch = e.message.match(/Line: (\d+)/)
    var errorLine = line
    if (lineMatch) errorLine += parseInt(lineMatch[1])
    const message = e.message.split('\n')[0]
    throw new UnprintedUserError(message, file.platformified(), errorLine)
  }
  const tableNode = new AstNode({
    type: 'table_open',
    tag: 'table',
    file,
    line,
    content: '',
    attributes: xml.table.$ || {}
  })
  result.pushNode(tableNode)
  if (xml.table.tr) parseRows(xml.table.tr, result, file, line)
  if (xml.table.thead) {
    result.pushNode({
      type: 'thead_open',
      tag: 'thead',
      file,
      line,
      content: '',
      attributes: xml.table.thead.$ || {}
    })
    parseRows(xml.table.thead[0].tr, result, file, line)
    result.pushNode({
      type: 'thead_close',
      tag: '/thead',
      file,
      line,
      content: '',
      attributes: xml.table.thead.$ || {}
    })
  }
  if (xml.table.tbody) {
    result.pushNode({
      type: 'tbody_open',
      tag: 'tbody',
      file,
      line,
      content: '',
      attributes: xml.table.tbody.$ || {}
    })
    parseRows(xml.table.tbody[0].tr, result, file, line)
    result.pushNode({
      type: 'tbody_close',
      tag: '/tbody',
      file,
      line,
      content: '',
      attributes: xml.table.tbody.$ || {}
    })
  }
  result.pushNode({
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
  file: AbsoluteFilePath,
  line: number
) {
  for (const row of block) {
    result.pushNode({
      type: 'table_row_open',
      tag: 'tr',
      file,
      line,
      content: row._ || '',
      attributes: row.$ || {}
    })

    for (const th of row.th || []) {
      result.pushNode({
        type: 'table_heading',
        tag: 'th',
        file,
        line,
        content: th._ || th,
        attributes: th.$ || {}
      })
    }
    for (const td of row.td || []) {
      result.pushNode({
        type: 'table_cell',
        tag: 'td',
        file,
        line,
        content: td._ || td,
        attributes: td.$ || {}
      })
    }
    result.pushNode({
      type: 'table_row_close',
      tag: '/tr',
      file,
      line,
      content: row._ || '',
      attributes: row.$ || {}
    })
  }
}
