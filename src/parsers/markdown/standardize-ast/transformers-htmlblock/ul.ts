import util from "util"
import xml2js from "xml2js"
import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"
import AstNodeList from "../../../ast-node-list.js"
import AstNode from "../../../ast-node.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import parseHtmlAttributes from "../../helpers/parse-html-attributes.js"

const xml2jsp = util.promisify(xml2js.parseString)

const ulRegex = /<ul([^>]*)>[\s\S]*<\/ul>/m

module.exports = async function transformUl(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(ulRegex)
  const xml = await xml2jsp(node.content)
  const ulNode = new AstNode({
    type: "bullet_list_open",
    tag: "ul",
    file,
    line,
    content: "",
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushNode(ulNode)
  for (const li of xml.ul.li) {
    result.pushNode({
      type: "list_item_open",
      tag: "li",
      file,
      line,
      content: li._,
      attributes: li.$ || {}
    })
  }
  result.pushNode({
    type: "bullet_list_close",
    tag: "/ul",
    file,
    line,
    content: "",
    attributes: ulNode.attributes
  })
  pretendToUse(openTags)
  return result
}
