import MarkdownIt from "markdown-it"
import * as util from "util"

import * as ast from "../../ast/index.js"
import { UserError } from "../../errors/user-error.js"
import * as files from "../../filesystem/index.js"
import * as html from "../html/index.js"
import { TagMapper } from "../tag-mapper.js"
import { ClosingTagParser } from "./closing-tag-parser.js"
import { OpenNodeTracker } from "./open-node-tracker.js"

export interface MarkdownItNode {
  /** HTML attributes. Format: `[[name1, value1], [name2, value2]]` */
  readonly attrs: [string, string][] | null

  /** An array of child nodes (inline and img tokens) */
  readonly children: MarkdownItNode[] | null

  /** In a case of self-closing tag (code, html, fence, etc.), it has contents of this tag. */
  readonly content: string

  /** Source map info. Format: `[line_begin, line_end]` */
  readonly map: [number, number] | null

  /** HTML tag name, e.g. "p" */
  readonly tag: string

  /** Type of the token, e.g. "paragraph_open" */
  readonly type: string
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
  parse(text: string, sourceDir: files.SourceDir, file: files.FullFilePath): ast.NodeList {
    const mdAST = this.markdownIt.parse(text, {})
    return this.standardizeAST(mdAST, new files.Location(sourceDir, file, 1), new OpenNodeTracker())
  }

  /** Converts the given MarkdownIt AST into the standard AST format */
  private standardizeAST(mdAST: MarkdownItAst, parentLocation: files.Location, ont: OpenNodeTracker): ast.NodeList {
    const result = new ast.NodeList()
    let currentLine = parentLocation.line
    for (const node of mdAST) {
      currentLine = Math.max((node.map || [0, 0])[0] + 1, currentLine)

      if (node.type === "image") {
        // need to handle images explicitly here because they have a text node as a child
        // but the AST shouldn't contain it
        result.push(...this.standardizeImageNode(node, parentLocation.withLine(currentLine)))
        continue
      }

      if (node.children) {
        result.push(...this.standardizeAST(node.children, parentLocation.withLine(currentLine), ont))
        continue
      }

      if (node.type === "softbreak") {
        currentLine += 1
        continue
      }

      result.push(...this.standardizeNode(node, parentLocation.withLine(currentLine), ont))
    }
    return result
  }

  /** Returns the standardized version of the given MarkdownIt node */
  private standardizeNode(mdNode: MarkdownItNode, location: files.Location, ont: OpenNodeTracker): ast.NodeList {
    // ignore empty text nodes
    // to avoid having to deal with this edge case later
    if (mdNode.type === "text" && mdNode.content === "") {
      return new ast.NodeList()
    }

    // special handling for headings to make them compatible with their HTML counterparts:
    // - they get renamed from heading_open to h1_open etc
    if (mdNode.type === "heading_open") {
      return this.standardizeHeadingOpen(mdNode, location)
    }

    // special handling for headings to make them compatible with their HTML counterparts:
    // - they get renamed from heading_close to h1_close etc
    if (mdNode.type === "heading_close") {
      return this.standardizeHeadingClose(mdNode, location)
    }

    // special handling for embedded code blocks to be compatible with its HTML counterpart:
    // - it is unrolled to code_open, text, code_close
    if (mdNode.type === "code_inline") {
      return this.standardizeCodeInline(mdNode, location)
    }

    // special handling for fenced code blocks to be compatible with its HTML counterpart:
    // - it is unrolled to fence_open, text, fence_close
    // - the content starts on the line below the opening ```
    if (mdNode.type === "fence") {
      return this.standardizeFence(mdNode, location)
    }

    // special handling for indented code blocks to be compatible with their HTML counterpart:
    // - they are expanded to fence_open, text, fence_close
    if (mdNode.type === "code_block") {
      return this.standardizeEmbeddedCodeblock(mdNode, location)
    }

    // handle embedded HTML
    if (mdNode.type === "html_inline" || mdNode.type === "html_block") {
      if (this.closingTagParser.isClosingTag(mdNode.content)) {
        return this.standardizeClosingHTMLTag(mdNode, ont, location)
      } else {
        return this.standardizeHTMLBlock(mdNode, ont, location)
      }
    }

    // handle opening tags
    if (mdNode.type.endsWith("_open")) {
      return this.standardizeOpeningNode(mdNode, location, ont)
    }

    // handle closing tags
    if (mdNode.type.endsWith("_close")) {
      return this.standardizeClosingNode(mdNode, location, ont)
    }

    // handle text nodes
    if (mdNode.type === "text") {
      return this.standardizeTextNode(mdNode, location)
    }

    // handle stand-alone tags
    if (this.tagMapper.isStandaloneTag(mdNode.tag)) {
      return this.standizeStandaloneTag(mdNode, location)
    }

    throw new Error(`unknown MarkdownIt node: ${util.inspect(mdNode)}`)
  }

  private standardizeImageNode(mdNode: MarkdownItNode, location: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    const attributes = standardizeMarkdownItAttributes(mdNode.attrs)
    for (const childNode of mdNode.children || []) {
      attributes.alt += childNode.content
    }
    result.push(
      new ast.Node({
        attributes,
        content: "",
        location,
        tag: "img",
        type: "image",
      }),
    )
    return result
  }

  private standardizeHeadingOpen(mdNode: MarkdownItNode, location: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: "",
        location,
        tag: mdNode.tag as ast.NodeTag,
        type: `${mdNode.tag}_open` as ast.NodeType,
      }),
    )
    return result
  }

  private standardizeHeadingClose(node: MarkdownItNode, location: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(node.attrs),
        content: "",
        location,
        tag: ("/" + node.tag) as ast.NodeTag,
        type: `${node.tag}_close` as ast.NodeType,
      }),
    )
    return result
  }

  private standardizeCodeInline(mdNode: MarkdownItNode, location: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: "",
        location,
        tag: "code",
        type: "code_open",
      }),
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: mdNode.content,
        location,
        tag: "",
        type: "text",
      }),
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: "",
        location,
        tag: "/code",
        type: "code_close",
      }),
    )
    return result
  }

  private standardizeEmbeddedCodeblock(mdNode: MarkdownItNode, location: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: "",
        location,
        tag: "pre",
        type: "fence_open",
      }),
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: mdNode.content.trim(),
        location,
        tag: "",
        type: "text",
      }),
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: "",
        location: location.withLine((mdNode.map || [0, 0])[1]),
        tag: "/pre",
        type: "fence_close",
      }),
    )
    return result
  }

  private standardizeFence(mdNode: MarkdownItNode, location: files.Location): ast.NodeList {
    const result = new ast.NodeList()

    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: "",
        location,
        tag: "pre",
        type: "fence_open",
      }),
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: mdNode.content.trim(),
        location: location.withLine(location.line + 1), // content of fenced blocks has to start on the next line
        tag: "",
        type: "text",
      }),
    )
    result.push(
      new ast.Node({
        attributes: {},
        content: "",
        location: location.withLine((mdNode.map || [0, 0])[1]),
        tag: "/pre",
        type: "fence_close",
      }),
    )
    return result
  }

  private standardizeClosingHTMLTag(
    mdNode: MarkdownItNode,
    ont: OpenNodeTracker,
    location: files.Location,
  ): ast.NodeList {
    const result = new ast.NodeList()
    const parsed = this.closingTagParser.parse(mdNode.content, location)[0]
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
          location,
        )
      }
    }
    ont.close(parsed.type, location)
    result.push(parsed)
    return result
  }

  private standardizeHTMLBlock(mdNode: MarkdownItNode, ont: OpenNodeTracker, location: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    const parsed = this.htmlParser.parse(mdNode.content, location)
    for (const node of parsed) {
      if (node.type.endsWith("_open")) {
        ont.open(node, (mdNode.map || [0, 0])[1])
      }
      if (node.type.endsWith("_close")) {
        ont.close(node.type, location)
      }
    }
    result.push(...parsed)
    return result
  }

  private standardizeOpeningNode(mdNode: MarkdownItNode, location: files.Location, ont: OpenNodeTracker): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        location,
        tag: this.tagMapper.tagForType(mdNode.type as ast.NodeType),
        type: mdNode.type as ast.NodeType,
      }),
    )
    ont.open(result[0], (mdNode.map || [0, 0])[1])
    return result
  }

  private standardizeClosingNode(mdNode: MarkdownItNode, location: files.Location, ont: OpenNodeTracker) {
    const result = new ast.NodeList()
    const openingNodeEndLine = ont.close(mdNode.type as ast.NodeType, location)
    let closingTagLine = location.line
    if (openingNodeEndLine) {
      closingTagLine = openingNodeEndLine
    }
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        location: location.withLine(closingTagLine),
        tag: this.tagMapper.tagForType(mdNode.type as ast.NodeType),
        type: mdNode.type as ast.NodeType,
      }),
    )
    return result
  }

  private standardizeTextNode(mdNode: MarkdownItNode, location: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        location,
        tag: this.tagMapper.tagForType(mdNode.type as ast.NodeType),
        type: mdNode.type as ast.NodeType,
      }),
    )
    return result
  }

  private standizeStandaloneTag(mdNode: MarkdownItNode, location: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: standardizeMarkdownItAttributes(mdNode.attrs),
        content: mdNode.content.trim(),
        location,
        tag: mdNode.tag as ast.NodeTag,
        type: mdNode.type as ast.NodeType,
      }),
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
