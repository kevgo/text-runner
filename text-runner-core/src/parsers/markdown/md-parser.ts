import * as MarkdownIt from "markdown-it"
import * as util from "util"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import * as html from "../html"
import * as ast from "../../ast"
import { TagMapper } from "../tag-mapper"
import { UserError } from "../../errors/user-error"
import { ClosingTagParser } from "./closing-tag-parser"
import { OpenNodeTracker } from "./open-node-tracker"

export interface MarkdownItNode {
  type: string // Type of the token, e.g. "paragraph_open"
  tag: string // HTML tag name, e.g. "p"
  attrs: [string, string][] | null //HTML attributes. Format: `[[name1, value1], [name2, value2]]`
  map: [number, number] | null // Source map info. Format: `[line_begin, line_end]`
  children: MarkdownItNode[] | null // An array of child nodes (inline and img tokens)
  content: string // In a case of self-closing tag (code, html, fence, etc.), it has contents of this tag.
}
export type MarkdownItAst = MarkdownItNode[]
export type MarkdownItNodeAttrs = string[][]

/** MarkdownParser parses Markdown. */
export class MarkdownParser {
  private readonly closingTagParser: ClosingTagParser

  /** parses HTML snippets into ast.NodeLists */
  private readonly htmlParser: html.Parser

  /** MarkdownIt instance */
  private readonly markdownIt: MarkdownIt

  /** helps map Markdown to HTML node types */
  private readonly tagMapper: TagMapper

  constructor() {
    this.markdownIt = new MarkdownIt({
      html: true,
      linkify: false,
    })
    this.tagMapper = new TagMapper()
    this.closingTagParser = new ClosingTagParser(this.tagMapper)
    this.htmlParser = new html.Parser(this.tagMapper)
  }

  /** returns the standard AST representing the given Markdown text */
  parse(text: string, file: AbsoluteFilePath): ast.NodeList {
    const mdAST = this.markdownIt.parse(text, {})
    return this.standardizeAST(mdAST, file, 1, new OpenNodeTracker())
  }

  /** Converts the given MarkdownIt AST into the standard AST format */
  private standardizeAST(
    mdAST: MarkdownItAst,
    file: AbsoluteFilePath,
    parentLine: number,
    ont: OpenNodeTracker
  ): ast.NodeList {
    const result = new ast.NodeList()
    let currentLine = parentLine
    for (const node of mdAST) {
      currentLine = Math.max((node.map || [0, 0])[0] + 1, currentLine)

      if (node.type === "image") {
        // need to handle images explicitly here because they have a text node as a child
        // but the AST shouldn't contain it
        result.push(...this.standardizeImageNode(node, file, currentLine))
        continue
      }

      if (node.children) {
        result.push(...this.standardizeAST(node.children, file, currentLine, ont))
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
    mdNode: MarkdownItNode,
    file: AbsoluteFilePath,
    line: number,
    ont: OpenNodeTracker
  ): ast.NodeList {
    // ignore empty text nodes
    // to avoid having to deal with this edge case later
    if (mdNode.type === "text" && mdNode.content === "") {
      return new ast.NodeList()
    }

    // special handling for headings to make them compatible with their HTML counterparts:
    // - they get renamed from heading_open to h1_open etc
    if (mdNode.type === "heading_open") {
      return this.standardizeHeadingOpen(mdNode, file, line)
    }

    // special handling for headings to make them compatible with their HTML counterparts:
    // - they get renamed from heading_close to h1_close etc
    if (mdNode.type === "heading_close") {
      return this.standardizeHeadingClose(mdNode, file, line)
    }

    // special handling for embedded code blocks to be compatible with its HTML counterpart:
    // - it is unrolled to code_open, text, code_close
    if (mdNode.type === "code_inline") {
      return this.standardizeCodeInline(mdNode, file, line)
    }

    // special handling for fenced code blocks to be compatible with its HTML counterpart:
    // - it is unrolled to fence_open, text, fence_close
    // - the content starts on the line below the opening ```
    if (mdNode.type === "fence") {
      return this.standardizeFence(mdNode, file, line)
    }

    // special handling for indented code blocks to be compatible with their HTML counterpart:
    // - they are expanded to fence_open, text, fence_close
    if (mdNode.type === "code_block") {
      return this.standardizeEmbeddedCodeblock(mdNode, file, line)
    }

    // handle embedded HTML
    if (mdNode.type === "html_inline" || mdNode.type === "html_block") {
      if (this.closingTagParser.isClosingTag(mdNode.content)) {
        return this.standardizeClosingHTMLTag(mdNode, ont, file, line)
      } else {
        return this.standardizeHTMLBlock(mdNode, ont, file, line)
      }
    }

    // handle opening tags
    if (mdNode.type.endsWith("_open")) {
      return this.standardizeOpeningNode(mdNode, file, line, ont)
    }

    // handle closing tags
    if (mdNode.type.endsWith("_close")) {
      return this.standardizeClosingNode(mdNode, file, line, ont)
    }

    // handle text nodes
    if (mdNode.type === "text") {
      return this.standardizeTextNode(mdNode, file, line)
    }

    // handle stand-alone tags
    if (this.tagMapper.isStandaloneTag(mdNode.tag)) {
      return this.standizeStandaloneTag(mdNode, file, line)
    }

    throw new Error(`unknown MarkdownIt node: ${util.inspect(mdNode)}`)
  }

  private standardizeImageNode(mdNode: MarkdownItNode, file: AbsoluteFilePath, line: number): ast.NodeList {
    const result = new ast.NodeList()
    const attributes = standardizeMarkdownItAttributes(mdNode.attrs)
    for (const childNode of mdNode.children || []) {
      attributes.alt += childNode.content
    }
    result.push(
      new ast.Node({
        attributes,
        content: "",
        file,
        line,
        tag: "img",
        type: "image",
      })
    )
    return result
  }

  private standardizeHeadingOpen(mdNode: MarkdownItNode, file: AbsoluteFilePath, line: number): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: "",
        file,
        line,
        tag: mdNode.tag as ast.NodeTag,
        type: `${mdNode.tag}_open` as ast.NodeType,
      })
    )
    return result
  }

  private standardizeHeadingClose(node: MarkdownItNode, file: AbsoluteFilePath, line: number): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(node.attrs),
        content: "",
        file,
        line,
        tag: ("/" + node.tag) as ast.NodeTag,
        type: `${node.tag}_close` as ast.NodeType,
      })
    )
    return result
  }

  private standardizeCodeInline(mdNode: MarkdownItNode, file: AbsoluteFilePath, line: number): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: "",
        file,
        line,
        tag: "code",
        type: "code_open",
      })
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: mdNode.content,
        file,
        line,
        tag: "",
        type: "text",
      })
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: "",
        file,
        line,
        tag: "/code",
        type: "code_close",
      })
    )
    return result
  }

  private standardizeEmbeddedCodeblock(mdNode: MarkdownItNode, file: AbsoluteFilePath, line: number): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: "",
        file,
        line,
        tag: "pre",
        type: "fence_open",
      })
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: mdNode.content.trim(),
        file,
        line,
        tag: "",
        type: "text",
      })
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: "",
        file,
        line: (mdNode.map || [line, line])[1],
        tag: "/pre",
        type: "fence_close",
      })
    )
    return result
  }

  private standardizeFence(mdNode: MarkdownItNode, file: AbsoluteFilePath, line: number): ast.NodeList {
    const result = new ast.NodeList()

    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: "",
        file,
        line,
        tag: "pre",
        type: "fence_open",
      })
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: mdNode.content.trim(),
        file,
        line: line + 1, // content of fenced blocks has to start on the next line
        tag: "",
        type: "text",
      })
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: "",
        file,
        line: (mdNode.map || [line, line])[1],
        tag: "/pre",
        type: "fence_close",
      })
    )
    return result
  }

  private standardizeClosingHTMLTag(
    mdNode: MarkdownItNode,
    ont: OpenNodeTracker,
    file: AbsoluteFilePath,
    line: number
  ): ast.NodeList {
    const result = new ast.NodeList()
    const parsed = this.closingTagParser.parse(mdNode.content, file, line)[0]
    if (parsed.tag === "/a") {
      // </a> could be anchor_close or link_close, figure this out here
      if (ont.has("link_open")) {
        parsed.type = "link_close"
      } else if (ont.has("anchor_open")) {
        parsed.type = "anchor_close"
      } else {
        throw new UserError(
          `Found neither open link nor anchor for node '${mdNode.content}'`,
          "I found a </a> tag here but there isn't an opening <a ...> tag above.",
          file,
          line
        )
      }
    }
    const closingNode: MarkdownItNode = {
      type: parsed.type,
      attrs: [],
      children: [],
      content: parsed.content,
      map: mdNode.map,
      tag: parsed.tag,
    }
    ont.close(closingNode, file, line)
    result.push(parsed)
    return result
  }

  private standardizeHTMLBlock(
    mdNode: MarkdownItNode,
    ont: OpenNodeTracker,
    file: AbsoluteFilePath,
    line: number
  ): ast.NodeList {
    const result = new ast.NodeList()
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
    mdNode: MarkdownItNode,
    file: AbsoluteFilePath,
    line: number,
    ont: OpenNodeTracker
  ): ast.NodeList {
    const result = new ast.NodeList()
    ont.open(mdNode)
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        file,
        line,
        tag: this.tagMapper.tagForType(mdNode.type),
        type: mdNode.type,
      })
    )
    return result
  }

  private standardizeClosingNode(mdNode: MarkdownItNode, file: AbsoluteFilePath, line: number, ont: OpenNodeTracker) {
    const result = new ast.NodeList()
    const openingNode = ont.close(mdNode, file, line)
    let closingTagLine = line
    if (openingNode.map) {
      closingTagLine = openingNode.map[1]
    }
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        file,
        line: closingTagLine,
        tag: this.tagMapper.tagForType(mdNode.type),
        type: mdNode.type,
      })
    )
    return result
  }

  private standardizeTextNode(mdNode: MarkdownItNode, file: AbsoluteFilePath, line: number): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        file,
        line,
        tag: this.tagMapper.tagForType(mdNode.type),
        type: mdNode.type,
      })
    )
    return result
  }

  private standizeStandaloneTag(mdNode: MarkdownItNode, file: AbsoluteFilePath, line: number): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        file,
        line,
        tag: mdNode.tag,
        type: mdNode.type,
      })
    )
    return result
  }
}

/** returns the given attributes from a MarkdownIt node in the standard AST format */
export function standardizeMarkdownItAttributes(attrs: MarkdownItNodeAttrs | null): ast.NodeAttributes {
  const result: ast.NodeAttributes = {}
  if (attrs) {
    for (const [name, value] of attrs) {
      result[name] = value
    }
  }
  return result
}
