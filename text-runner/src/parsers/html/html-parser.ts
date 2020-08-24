import * as parse5 from "parse5"
import * as util from "util"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNode, AstNodeTags } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { TagMapper } from "../tag-mapper"
import { standardizeHTMLAttributes } from "./helpers/standardize-html-attributes"

/** HtmlParser converts HTML5 source into the standardized AST format. */
export class HTMLParser {
  private readonly tagMapper: TagMapper

  constructor(tagMapper: TagMapper) {
    this.tagMapper = tagMapper
  }

  /**
   * Parse returns the standard AST for the given HTML text.
   *
   * @param file The file in which the given text happens (for error messages)
   * @param startingLine The line at which this HTML snippet is located in the source document.
   *                     This parameter helps show correct line numbers for HTML snippets
   *                     that are embedded in Markdown documents.
   */
  parse(text: string, file: AbsoluteFilePath, startingLine: number): AstNodeList {
    const htmlAst = parse5.parse(text, {
      sourceCodeLocationInfo: true,
    })
    return this.standardizeDocument(htmlAst, file, startingLine)
  }

  /** returns whether the given HTML node is an empty text node */
  private isEmptyTextNode(node: any): boolean {
    return node.nodeName === "#text" && node.value.trim() === ""
  }

  /** returns the subtree of the given HTML AST whose root node has the given name */
  private findChildWithName(node: any, name: string): any {
    for (const childNode of node.childNodes) {
      if (childNode.nodeName === name) {
        return childNode
      }
    }
    throw new Error(`child node '${name}' not found in AST: ${util.inspect(node)}`)
  }

  /**
   * converts the given HTML AST for an entire HTML document into the standard AST
   */
  private standardizeDocument(documentAst: any, file: AbsoluteFilePath, startingLine: number = 1): AstNodeList {
    const result = new AstNodeList()
    const htmlNode = this.findChildWithName(documentAst, "html")
    const bodyNode = this.findChildWithName(htmlNode, "body")
    for (const childNode of bodyNode.childNodes) {
      result.push(...this.standardizeNode(childNode, file, startingLine))
    }
    return result
  }

  /** converts the given HTML AST node into the standard format */
  private standardizeNode(node: any, file: AbsoluteFilePath, startingLine: number): AstNodeList {
    if (this.isEmptyTextNode(node)) {
      return new AstNodeList()
    }
    if (node.nodeName === "#text") {
      return this.standardizeTextNode(node, file, startingLine)
    }
    if (this.tagMapper.isStandaloneTag(node.nodeName)) {
      return this.standardizeStandaloneNode(node, file, startingLine)
    }
    return this.standardizeOpenCloseTag(node, file, startingLine)
  }

  /** converts the given HTML tag with open and closing tag into the standard format */
  private standardizeOpenCloseTag(node: any, file: AbsoluteFilePath, startingLine: number): AstNodeList {
    const result = new AstNodeList()
    const attributes = standardizeHTMLAttributes(node.attrs)

    // store the opening node
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
        type: this.tagMapper.openingTypeForTag(node.tagName, attributes),
      })
    )

    // store the child nodes in between the opening and closing node
    for (const childNode of node.childNodes) {
      const standardizedChildNodes = this.standardizeNode(childNode, file, startingLine)
      result.push(...standardizedChildNodes)
    }

    // store the closing node
    let endLine: number
    if (node.sourceCodeLocation) {
      endLine = node.sourceCodeLocation.endLine + startingLine - 1
    } else if (node.parentNode && node.parentNode.sourceCodeLocation) {
      endLine = node.parentNode.sourceCodeLocation.endLine + startingLine - 1
    } else {
      throw new Error(`cannot determine end line for node ${node}`)
    }
    if (!node.sourceCodeLocation || (node.sourceCodeLocation && node.sourceCodeLocation.endTag)) {
      const tag = ("/" + node.tagName) as AstNodeTags
      result.push(
        new AstNode({
          attributes: {},
          content: "",
          file,
          line: endLine,
          tag,
          type: this.tagMapper.typeForTag(tag, attributes),
        })
      )
    }
    return result
  }

  /** converts the given HTML standalone node into the standard format */
  private standardizeStandaloneNode(node: any, file: AbsoluteFilePath, startingLine: number): AstNodeList {
    const result = new AstNodeList()
    const attributes = standardizeHTMLAttributes(node.attrs)
    result.push(
      new AstNode({
        attributes,
        content: "",
        file,
        line: node.sourceCodeLocation.startLine + startingLine - 1,
        tag: node.tagName || "",
        type: this.tagMapper.typeForTag(node.tagName, attributes),
      })
    )
    return result
  }

  /** converts the given HTML text node into the standard format */
  private standardizeTextNode(node: any, file: AbsoluteFilePath, startingLine: number): AstNodeList {
    const result = new AstNodeList()
    if (node.value !== "\n") {
      result.push(
        new AstNode({
          attributes: {},
          content: node.value.trim(),
          file,
          line: node.sourceCodeLocation.startLine + startingLine - 1,
          tag: node.tagName || "",
          type: "text",
        })
      )
    }
    return result
  }
}
