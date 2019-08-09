import MarkdownIt from "markdown-it"
import util from "util"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { HTMLParser } from "../html/html-parser"
import { AstNode, AstNodeAttributes } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { TagMapper } from "../tag-mapper"
import { ClosingTagParser } from "./helpers/closing-tag-parser"
import { OpenNodeTracker } from "./helpers/open-node-tracker"

/** MarkdownParser is a DocumentsParser that parses Markdown. */
export class MarkdownParser {
  private readonly closingTagParser: ClosingTagParser

  /** parses HTML snippets into AstNodeLists */
  private readonly htmlParser: HTMLParser

  /** MarkdownIt instance */
  private readonly markdownIt: MarkdownIt

  /** helps map Markdown to HTML node types */
  private readonly tagMapper: TagMapper

  constructor() {
    this.markdownIt = new MarkdownIt({
      html: true,
      linkify: false
    })
    this.tagMapper = new TagMapper()
    this.closingTagParser = new ClosingTagParser(this.tagMapper)
    this.htmlParser = new HTMLParser(this.tagMapper)
  }

  /** returns the standard AST representing the given Markdown text */
  parse(text: string, file: AbsoluteFilePath): AstNodeList {
    const mdAST = this.markdownIt.parse(text, {})
    return this.standardizeAST(mdAST, file, 1, new OpenNodeTracker())
  }

  /** Converts the given MarkdownIt AST into the standard AST format */
  private standardizeAST(
    mdAST: any,
    file: AbsoluteFilePath,
    parentLine: number,
    ont: OpenNodeTracker
  ) {
    const result = new AstNodeList()
    let currentLine = parentLine
    for (const node of mdAST) {
      currentLine = Math.max((node.map || [[0]])[0] + 1, currentLine)

      if (node.type === "image") {
        // need to handle images explicitly here because they have a text node as a child
        // but the AST shouldn't contain it
        result.push(...this.standardizeImageNode(node, file, currentLine))
        continue
      }

      if (node.children) {
        result.push(
          ...this.standardizeAST(node.children, file, currentLine, ont)
        )
        continue
      }

      if (node.type === "softbreak") {
        currentLine += 1
        continue
      }

      result.push(...this.standardizeNode(node, file, currentLine, ont))
    }
    return result
  }

  /** Returns the standardized version of the given MarkdownIt node */
  private standardizeNode(
    mdNode: any,
    file: AbsoluteFilePath,
    line: number,
    ont: OpenNodeTracker
  ): AstNodeList {
    if (mdNode.type === "text" && mdNode.content === "") {
      return new AstNodeList()
    }

    if (mdNode.type === "heading_open") {
      return this.standardizeHeadingOpen(mdNode, file, line)
    }

    if (mdNode.type === "heading_close") {
      return this.standardizeHeadingClose(mdNode, file, line)
    }

    if (mdNode.type === "code_inline") {
      return this.standardizeCodeInline(mdNode, file, line)
    }

    if (mdNode.type === "fence") {
      return this.standardizeFence(mdNode, file, line)
    }

    if (mdNode.type === "html_inline" || mdNode.type === "html_block") {
      if (this.closingTagParser.isClosingTag(mdNode.content)) {
        return this.standardizeClosingHTMLTag(mdNode, ont, file, line)
      } else {
        return this.standardizeHTMLBlock(mdNode, ont, file, line)
      }
    }

    if (mdNode.type.endsWith("_open")) {
      return this.standardizeOpeningNode(mdNode, file, line, ont)
    }

    if (mdNode.type.endsWith("_close")) {
      return this.standardizeClosingNode(mdNode, file, line, ont)
    }

    if (mdNode.type === "text") {
      return this.standardizeTextNode(mdNode, file, line)
    }

    if (this.tagMapper.isStandaloneTag(mdNode.tag)) {
      return this.standizeStandaloneTag(mdNode, file, line)
    }

    throw new Error(`unknown MarkdownIt node: ${util.inspect(mdNode)}`)
  }

  private standardizeImageNode(
    mdNode: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    const attributes = standardizeMarkdownItAttributes(mdNode.attrs)
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

  private standardizeHeadingOpen(
    mdNode: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    result.push(
      new AstNode({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: "",
        file,
        line,
        tag: mdNode.tag,
        type: `${mdNode.tag}_open`
      })
    )
    return result
  }

  private standardizeHeadingClose(
    node: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    result.push(
      new AstNode({
        attributes: standardizeMarkdownItAttributes(node.attrs),
        content: "",
        file,
        line,
        tag: "/" + node.tag,
        type: `${node.tag}_close`
      })
    )
    return result
  }

  private standardizeCodeInline(
    mdNode: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    const attributes = standardizeMarkdownItAttributes(mdNode.attrs)
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

  private standardizeFence(
    mdNode: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    const attributes = standardizeMarkdownItAttributes(mdNode.attrs)
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

  private standardizeClosingHTMLTag(
    mdNode: any,
    ont: OpenNodeTracker,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    const parsed = this.closingTagParser.parse(mdNode.content, file, line)[0]
    if (parsed.tag === "/a") {
      // </a> could be anchor_close or link_close, figure this out here
      if (ont.has("link_open")) {
        parsed.type = "link_close"
      } else if (ont.has("anchor_open")) {
        parsed.type = "anchor_close"
      } else {
        throw new Error("Found neither open link nor anchor")
      }
    }
    ont.close({ type: parsed.type }, file, line)
    result.push(parsed)
    return result
  }

  private standardizeHTMLBlock(
    mdNode: any,
    ont: OpenNodeTracker,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    const parsed = this.htmlParser.parse(mdNode.content, file, line)
    for (const node of parsed) {
      if (node.type.endsWith("_open")) {
        ont.open(node)
      }
      if (node.type.endsWith("_close")) {
        ont.close(node, file, line)
      }
    }
    result.push(...parsed)
    return result
  }

  private standardizeOpeningNode(
    mdNode: any,
    file: AbsoluteFilePath,
    line: number,
    ont: OpenNodeTracker
  ): AstNodeList {
    const result = new AstNodeList()
    ont.open(mdNode)
    result.push(
      new AstNode({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        file,
        line,
        tag: this.tagMapper.tagForType(mdNode.type),
        type: mdNode.type
      })
    )
    return result
  }

  private standardizeClosingNode(
    mdNode: any,
    file: AbsoluteFilePath,
    line: number,
    ont: OpenNodeTracker
  ) {
    const result = new AstNodeList()
    const openingNode = ont.close(mdNode, file, line)
    let closingTagLine = line
    if (openingNode.map) {
      closingTagLine = openingNode.map[1]
    }
    result.push(
      new AstNode({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        file,
        line: closingTagLine,
        tag: this.tagMapper.tagForType(mdNode.type),
        type: mdNode.type
      })
    )
    return result
  }

  private standardizeTextNode(
    mdNode: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    result.push(
      new AstNode({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        file,
        line,
        tag: this.tagMapper.tagForType(mdNode.type),
        type: mdNode.type
      })
    )
    return result
  }

  private standizeStandaloneTag(
    mdNode: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    result.push(
      new AstNode({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        file,
        line,
        tag: mdNode.tag,
        type: mdNode.type
      })
    )
    return result
  }
}

/** returns the given attributes from a MarkdownIt node in the standard AST format */
export function standardizeMarkdownItAttributes(attrs: any): AstNodeAttributes {
  const result: AstNodeAttributes = {}
  if (attrs) {
    for (const [name, value] of attrs) {
      result[name] = value
    }
  }
  return result
}
