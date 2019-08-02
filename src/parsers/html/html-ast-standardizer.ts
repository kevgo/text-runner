import parse5 from "parse5"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNode, AstNodeAttributes } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { TagMapper } from "../tag-mapper"

/** HtmlAstStandardizer converts HTML5 ASTs into standardized ASTs. */
export class HtmlAstStandardizer {
  private readonly tagMapper: TagMapper

  constructor(tagMapper: TagMapper) {
    this.tagMapper = tagMapper
  }

  /**
   * StandardizeDocument converts the given MarkdownIt AST into the standardized AST.
   *
   * @param startingLine The line at which this HTML snippet is located in the source document.
   *                     This parameter only applies for HTML snippets that are embedded in Markdown documents.
   */
  standardizeDocument(
    htmlAst: any,
    file: AbsoluteFilePath,
    startingLine: number = 1
  ): AstNodeList {
    const result = new AstNodeList()
    const htmlNode = htmlAst.childNodes.filter(
      (node: parse5.DefaultTreeElement) => node.nodeName === "html"
    )[0]
    const bodyNode = htmlNode.childNodes.filter(
      (node: parse5.DefaultTreeElement) => node.nodeName === "body"
    )[0]
    for (const childNode of bodyNode.childNodes) {
      const astNodes = this.standardizeNode(childNode, file, startingLine)
      result.push(...astNodes)
    }
    return result
  }

  standardizeNode(
    node: any,
    file: AbsoluteFilePath,
    startingLine: number
  ): AstNodeList {
    const result = new AstNodeList()

    // ignore empty text nodes
    if (node.nodeName === "#text" && node.value.trim() === "") {
      return result
    }

    // calculate attributes
    const attributes: AstNodeAttributes = {}
    if (node.attrs) {
      for (const attr of node.attrs) {
        attributes[attr.name] = attr.value
      }
    }

    // handle open-close tags
    if (this.tagMapper.isOpenCloseTag(node.nodeName)) {
      let startLine = startingLine
      if (node.sourceCodeLocation) {
        startLine += node.sourceCodeLocation.startLine - 1
      } else if (node.parentNode && node.parentNode.sourceCodeLocation) {
        startLine += node.parentNode.sourceCodeLocation.startLine
      }
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line: startLine,
          tag: node.tagName,
          type: this.tagMapper.openingTypeForTag(node.tagName, attributes)
        })
      )
      for (const childNode of node.childNodes) {
        const standardizedChildNodes = this.standardizeNode(
          childNode,
          file,
          startingLine
        )
        result.push(...standardizedChildNodes)
      }
      let endLine: number
      if (node.sourceCodeLocation) {
        endLine = node.sourceCodeLocation.endLine + startingLine - 1
      } else if (node.parentNode && node.parentNode.sourceCodeLocation) {
        endLine = node.parentNode.sourceCodeLocation.endLine + startingLine - 1
      } else {
        throw new Error(`cannot determine end line for node ${node}`)
      }
      if (
        !node.sourceCodeLocation ||
        (node.sourceCodeLocation && node.sourceCodeLocation.endTag)
      ) {
        const tag = "/" + node.tagName
        result.push(
          new AstNode({
            attributes: {},
            content: "",
            file,
            line: endLine,
            tag,
            type: this.tagMapper.typeForTag(tag, attributes)
          })
        )
      }
    } else if (node.nodeName === "#text") {
      // textnode
      if (node.value !== "\n") {
        result.push(
          new AstNode({
            attributes: {},
            content: node.value.trim(),
            file,
            line: node.sourceCodeLocation.startLine + startingLine - 1,
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
          line: node.sourceCodeLocation.startLine + startingLine - 1,
          tag: node.tagName || "",
          type: this.tagMapper.typeForTag(node.tagName, attributes)
        })
      )
    }
    return result
  }
}
