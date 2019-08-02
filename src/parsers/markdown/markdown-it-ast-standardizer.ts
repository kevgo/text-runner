import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { HTMLParser } from "../html/html-parser"
import { AstNode, AstNodeAttributes } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { TagMapper } from "../tag-mapper"
import { ClosingTagParser } from "./closing-tag-parser"
import { OpenNodeTracker } from "./open-node-tracker"

/**
 * MarkdownItAstStandardizer converts an AST created by MarkdownIt
 * into the standardized AST format.
 */
export default class MarkdownItAstStandardizer {
  private readonly closingTagParser: ClosingTagParser

  /** the MarkdownIt AST to convert */
  private readonly mdAst: any

  /** the path of the file from which the MarkdownIt AST is from */
  private readonly filepath: AbsoluteFilePath

  /** parses HTML snippets into AstNodeLists */
  private readonly htmlParser: HTMLParser

  private readonly tagMapper: TagMapper

  private readonly openNodeTracker: OpenNodeTracker

  constructor(mdAST: any, filepath: AbsoluteFilePath) {
    this.mdAst = mdAST
    this.filepath = filepath
    this.tagMapper = new TagMapper()
    this.htmlParser = new HTMLParser(this.tagMapper)
    this.closingTagParser = new ClosingTagParser(this.tagMapper)
    this.openNodeTracker = new OpenNodeTracker()
  }

  /** returns the standardized AST for the MarkdownIt-based AST given in the constructor */
  standardized(): AstNodeList {
    return this.standardizeAST(this.mdAst, 1)
  }

  /** Converts the given MarkdownIt AST into the standard AST format */
  private standardizeAST(mdAST: any, parentLine: number) {
    const result = new AstNodeList()
    let currentLine = parentLine
    for (const node of mdAST) {
      // determine the current line we are on
      currentLine = Math.max((node.map || [[0]])[0] + 1, currentLine)

      // special handling for images
      if (node.type === "image") {
        const standardized = this.standardizeNode(
          node,
          this.filepath,
          currentLine
        )
        result.push(...standardized)
        continue
      }

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
        currentLine
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

    // ignore empty text blocks
    if (mdNode.type === "text" && mdNode.content === "") {
      return result
    }

    const attributes: AstNodeAttributes = {}
    if (mdNode.attrs) {
      for (const [name, value] of mdNode.attrs) {
        attributes[name] = value
      }
    }

    // handle images
    if (mdNode.type === "image") {
      for (const childNode of mdNode.children) {
        attributes.alt += childNode.content
      }
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line,
          tag: "img",
          type: "image"
        })
      )
      return result
    }

    // handle headings
    if (mdNode.type === "heading_open") {
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line,
          tag: mdNode.tag,
          type: `${mdNode.tag}_open`
        })
      )
      return result
    }
    if (mdNode.type === "heading_close") {
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line,
          tag: "/" + mdNode.tag,
          type: `${mdNode.tag}_close`
        })
      )
      return result
    }

    // handle code_inline blocks
    if (mdNode.type === "code_inline") {
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line,
          tag: "code",
          type: "code_open"
        })
      )
      result.push(
        new AstNode({
          attributes,
          content: mdNode.content,
          file,
          line,
          tag: "",
          type: "text"
        })
      )
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line,
          tag: "/code",
          type: "code_close"
        })
      )
      return result
    }

    // handle fence blocks
    if (mdNode.type === "fence") {
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line,
          tag: "pre",
          type: "fence_open"
        })
      )
      result.push(
        new AstNode({
          attributes,
          content: mdNode.content.trim(),
          file,
          line: line + 1, // content of fenced blocks has to start on the next line
          tag: "",
          type: "text"
        })
      )
      result.push(
        new AstNode({
          attributes,
          content: "",
          file,
          line: mdNode.map[1],
          tag: "/pre",
          type: "fence_close"
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
        const mdNodes = this.htmlParser.parseInline(mdNode.content, file, line)
        result.push(...mdNodes)
      }
      return result
    }

    // handle opening nodes
    if (mdNode.type.endsWith("_open")) {
      this.openNodeTracker.open(mdNode)
      result.push(
        new AstNode({
          attributes,
          content: mdNode.content.trim(),
          file,
          line,
          tag: this.tagMapper.tagForType(mdNode.type),
          type: mdNode.type
        })
      )
      return result
    }

    // handle closing nodes
    if (mdNode.type.endsWith("_close")) {
      const openingNode = this.openNodeTracker.close(mdNode, file, line)
      let closingTagLine = line
      if (openingNode.map) {
        closingTagLine = openingNode.map[1]
      }
      result.push(
        new AstNode({
          attributes,
          content: mdNode.content.trim(),
          file,
          line: closingTagLine,
          tag: this.tagMapper.tagForType(mdNode.type),
          type: mdNode.type
        })
      )
      return result
    }

    // handle text nodes
    if (mdNode.type === "text") {
      result.push(
        new AstNode({
          attributes,
          content: mdNode.content.trim(),
          file,
          line,
          tag: this.tagMapper.tagForType(mdNode.type),
          type: mdNode.type
        })
      )
      return result
    }

    // handle all known stand-alone tags
    if (this.tagMapper.isStandaloneTag(mdNode.tag)) {
      result.push(
        new AstNode({
          attributes,
          content: mdNode.content.trim(),
          file,
          line,
          tag: mdNode.tag,
          type: mdNode.type
        })
      )
      return result
    }

    console.log(mdNode)
    throw new Error(`unknown RemarkableIt node type: ${mdNode.type}`)
  }

  private isSoftBreak(node: any): boolean {
    return node.type === "softbreak"
  }
}
