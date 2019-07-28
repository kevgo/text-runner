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
    startingLine: number,
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
        // NOTE: need to substract 1 here because we add two line numbers
        //       who both started counting at 1 here
        (childNode.sourceCodeLocation.startLine || 1) + startingLine - 1
      )
      result.push(...astNodes)
    }
    return result
  }

  standardizeNode(
    node: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    const attributes: AstNodeAttributes = {}
    if (node.attrs) {
      for (const attr of node.attrs) {
        attributes[attr.name] = attr.value
      }
    }
    if (this.tagMapper.isOpenCloseTag(node.nodeName)) {
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line,
          tag: node.tagName,
          type: this.tagMapper.openingTypeForTag(node.tagName, attributes)
        })
      )
      for (const childNode of node.childNodes) {
        const standardizedChildNodes = this.standardizeNode(
          childNode,
          file,
          line
        )
        result.push(...standardizedChildNodes)
      }
      const tag = "/" + node.tagName
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line,
          tag,
          type: this.tagMapper.typeForTag(tag, attributes)
        })
      )
    } else if (node.nodeName === "#text") {
      // textnode
      if (node.value !== "\n") {
        result.push(
          new AstNode({
            attributes: {},
            content: node.value,
            file,
            line,
            tag: node.tagName || "",
            type: "text"
          })
        )
      }
    } else {
      // not an open-close node
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line,
          tag: node.tagName || "",
          type: this.tagMapper.typeForTag(node.tagName, attributes)
        })
      )
    }
    return result
  }
}
