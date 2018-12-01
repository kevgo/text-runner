import util from 'util'
import xml2js from 'xml2js'
import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import UnprintedUserError from '../../../../errors/unprinted-user-error'
import pretendToUse from '../../../../helpers/pretend-to-use'
import AstNode from '../../../ast-node'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'

const xml2jsp = util.promisify(xml2js.parseString)

export default async function transformTable(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  let xml: any = {}
  try {
    xml = await xml2jsp(node.content)
  } catch (e) {
    const lineMatch = e.message.match(/Line: (\d+)/)
    let errorLine = line
    if (lineMatch) {
      errorLine += parseInt(lineMatch[1], 10)
    }
    const message = e.message.split('\n')[0]
    throw new UnprintedUserError(message, file.platformified(), errorLine)
  }
  const tableNode = new AstNode({
    attributes: xml.table.$ || {},
    content: '',
    file,
    line,
    tag: 'table',
    type: 'table_open'
  })
  result.pushNode(tableNode)
  if (xml.table.tr) {
    parseRows(xml.table.tr, result, file, line)
  }
  if (xml.table.thead) {
    result.pushNode({
      attributes: xml.table.thead.$ || {},
      content: '',
      file,
      line,
      tag: 'thead',
      type: 'thead_open'
    })
    parseRows(xml.table.thead[0].tr, result, file, line)
    result.pushNode({
      attributes: xml.table.thead.$ || {},
      content: '',
      file,
      line,
      tag: '/thead',
      type: 'thead_close'
    })
  }
  if (xml.table.tbody) {
    result.pushNode({
      attributes: xml.table.tbody.$ || {},
      content: '',
      file,
      line,
      tag: 'tbody',
      type: 'tbody_open'
    })
    parseRows(xml.table.tbody[0].tr, result, file, line)
    result.pushNode({
      attributes: xml.table.tbody.$ || {},
      content: '',
      file,
      line,
      tag: '/tbody',
      type: 'tbody_close'
    })
  }
  result.pushNode({
    attributes: tableNode.attributes,
    content: '',
    file,
    line,
    tag: '/table',
    type: 'table_close'
  })
  pretendToUse(openTags)
  return result
}

function parseRows(
  block: any,
  result: AstNodeList,
  file: AbsoluteFilePath,
  line: number
) {
  for (const row of block) {
    result.pushNode({
      attributes: row.$ || {},
      content: row._ || '',
      file,
      line,
      tag: 'tr',
      type: 'table_row_open'
    })

    for (const th of row.th || []) {
      result.pushNode({
        attributes: th.$ || {},
        content: th._ || th,
        file,
        line,
        tag: 'th',
        type: 'table_heading'
      })
    }
    for (const td of row.td || []) {
      result.pushNode({
        attributes: td.$ || {},
        content: td._ || td,
        file,
        line,
        tag: 'td',
        type: 'table_cell'
      })
    }
    result.pushNode({
      attributes: row.$ || {},
      content: row._ || '',
      file,
      line,
      tag: '/tr',
      type: 'table_row_close'
    })
  }
}
