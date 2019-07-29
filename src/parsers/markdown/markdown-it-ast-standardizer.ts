import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { HTMLParser } from "../html/html-parser"
import { AstNode } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { TagMapper } from "../tag-mapper"
import { ClosingTagParser } from "./closing-tag-parser"

/**
 * MarkdownItAstStandardizer converts an AST created by MarkdownIt
 * into the standardized AST format.
 */
export default class MarkdownItAstStandardizer {
  closingTagParser: ClosingTagParser

  /** the MarkdownIt AST to convert */
  mdAst: any

  /** the path of the file from which the MarkdownIt AST is from */
  filepath: AbsoluteFilePath

  /** parses HTML snippets into AstNodeLists */
  htmlParser: HTMLParser

  tagMapper: TagMapper

  constructor(mdAST: any, filepath: AbsoluteFilePath) {
    this.mdAst = mdAST
    this.filepath = filepath
    this.htmlParser = new HTMLParser()
    this.closingTagParser = new ClosingTagParser()
    this.tagMapper = new TagMapper()
  }

  /** returns the standardized AST for the MarkdownIt-based AST given in the constructor */
  standardized(): AstNodeList {
    return this.standardizeAST(this.mdAst, 1)
  }

  /** Converts the given MarkdownIt AST into the standard AST format */
  private standardizeAST(mdAST: any, parentLine: number) {
    const result = new AstNodeList()
    for (const node of mdAST) {
      // determine the current line we are on
      let currentLine = Math.max(parentLine, (node.map || [[0]])[0])

      // handle node with children
      if (node.children) {
        const standardizedChildNodes = this.standardizeAST(
          node.children,
          currentLine
        )
        result.push(...standardizedChildNodes)
        continue
      }

      // handle softbreak
      if (this.isSoftBreak(node)) {
        currentLine += 1
        continue
      }

      // handle node without children
      const standardizedNode = this.standardizeNode(
        node,
        this.filepath,
        currentLine + parentLine - 1
      )
      result.push(...standardizedNode)
    }
    return result
  }

  /** Returns the standardized version of the given MarkdownIt node */
  private standardizeNode(
    mdNode: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    console.log(mdNode)

    // ignore empty text blocks
    if (mdNode.type === "text" && mdNode.content === "") {
      return result
    }

    // handle opening/closing and text nodes
    if (
      mdNode.type.endsWith("_open") ||
      mdNode.type.endsWith("_close") ||
      mdNode.type === "text"
    ) {
      result.push(
        new AstNode({
          attributes: mdNode.attrs || {},
          content: mdNode.content,
          file,
          line,
          tag: this.tagMapper.tagForType(mdNode.type),
          type: mdNode.type
        })
      )
      return result
    }

    // handle code blocks
    if (mdNode.type === "code_inline") {
      result.push(
        new AstNode({
          attributes: {},
          content: "",
          file,
          line,
          tag: "code",
          type: "code_open"
        })
      )
      result.push(
        new AstNode({
          attributes: {},
          content: mdNode.content,
          file,
          line,
          tag: "",
          type: "text"
        })
      )
      result.push(
        new AstNode({
          attributes: {},
          content: "",
          file,
          line,
          tag: "/code",
          type: "code_close"
        })
      )
      return result
    }

    // handle HTML blocks
    if (mdNode.type === "html_inline" || mdNode.type === "html_block") {
      if (this.closingTagParser.isClosingTag(mdNode.content)) {
        const closingTagNodes = this.closingTagParser.parse(
          mdNode.content,
          file,
          line
        )
        result.push(...closingTagNodes)
      } else {
        const mdNodes = this.htmlParser.parseInline(
          mdNode.content,
          file,
          line,
          true
        )
        console.log(mdNodes)
        result.push(...mdNodes)
      }
      return result
    }
    throw new Error(`unknown RemarkableIt node type: ${mdNode.type}`)
  }

  private isSoftBreak(node: any): boolean {
    return node.type === "softbreak"
  }
}
