import parse5 from "parse5"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNode, AstNodeAttributes } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { TagMapper } from "../tag-mapper"

/** HtmlAstStandardizer converts HTML5 ASTs into standardized ASTs. */
export class HtmlAstStandardizer {
  tagMapper: TagMapper

  constructor() {
    this.tagMapper = new TagMapper()
  }

  standardizeDocument(
    htmlAst: any,
    file: AbsoluteFilePath,
    // @ts-ignore
    inline: boolean
  ): AstNodeList {
    const result = new AstNodeList()
    const htmlNode = htmlAst.childNodes.filter(
      (node: parse5.DefaultTreeElement) => node.nodeName === "html"
    )[0]
    const bodyNode = htmlNode.childNodes.filter(
      (node: parse5.DefaultTreeElement) => node.nodeName === "body"
    )[0]
    for (const childNode of bodyNode.childNodes) {
      const astNodes = this.standardizeNode(
        childNode,
        file,
        childNode.sourceCodeLocation.startLine || 1
      )
      result.push(...astNodes)
    }
    return result
  }

  standardizeNode(
    node: parse5.DefaultTreeElement,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    console.log(node.nodeName)
    if (this.tagMapper.isOpenCloseTag(node.nodeName)) {
      const attributes: AstNodeAttributes = {}
      for (const attr of node.attrs) {
        attributes[attr.name] = attr.value
      }
      const n = new AstNode({
        attributes,
        content: "",
        file,
        line,
        tag: node.tagName,
        type: this.tagMapper.typeForTag(node.tagName, attributes)
      })
      result.push(n)
    }
    return result
  }
}
