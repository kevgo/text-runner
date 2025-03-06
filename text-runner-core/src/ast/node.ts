import * as files from "../filesystem/index.js"

export type NodeAttributes = Record<string, string>

export interface NodeScaffoldData {
  attributes?: NodeAttributes
  content?: string
  file?: files.FullFilePath | string
  line?: number
  sourceDir?: string
  tag?: NodeTag
  type?: NodeType
}

export type NodeScaffoldDataReadonly = Readonly<NodeScaffoldData>

/** the HTML tags */
export type NodeTag =
  | "" // text node
  | "/a"
  | "/b"
  | "/code"
  | "/pre"
  | "a"
  | "b"
  | "br"
  | "code"
  | "hr"
  | "i"
  | "img"
  | "li"
  | "ol"
  | "p"
  | "pre"
  | "ul"

/** the MarkdownIt node types */
export type NodeType =
  | "anchor_close"
  | "anchor_open"
  | "bold_close"
  | "bold_open"
  | "bullet_list_close"
  | "bullet_list_open"
  | "code_close"
  | "code_open"
  | "fence_close"
  | "fence_open"
  | "h1_close"
  | "h1_open"
  | "h2_close"
  | "h2_open"
  | "h3_close"
  | "h3_open"
  | "h4_close"
  | "h4_open"
  | "h5_close"
  | "h5_open"
  | "h6_close"
  | "h6_open"
  | "heading_close"
  | "heading_open"
  | "hr"
  | "htmltag"
  | "image"
  | "linebreak"
  | "link_close"
  | "link_open"
  | "paragraph_close"
  | "paragraph_open"
  | "text" // text node

/** a node in the standardized Markdown/HTML AST */
export class Node {
  /** the attributes of the node */
  readonly attributes: NodeAttributes

  /** textual content of this AST node */
  readonly content: string

  /** the file in which this AstNode occurs */
  readonly location: files.Location

  /** HTML type of AST node */
  readonly tag: NodeTag

  /** markdown type of AST node */
  type: NodeType

  constructor(data: {
    attributes: NodeAttributes
    content: string
    location: files.Location
    tag: NodeTag
    type: NodeType
  }) {
    this.type = data.type
    this.tag = data.tag
    this.location = data.location
    this.content = data.content
    this.attributes = data.attributes
  }

  static scaffold(data: NodeScaffoldData = {}): Node {
    if (typeof data.file === "string") {
      data.file = new files.FullFilePath(data.file)
    }
    return new Node({
      attributes: data.attributes || {},
      content: data.content || "",
      location: new files.Location(
        new files.SourceDir(data.sourceDir || ""),
        data.file || new files.FullFilePath("file"),
        data.line || 1
      ),
      tag: data.tag != null ? data.tag : "hr",
      type: data.type || "hr"
    })
  }

  /** Returns the type of the corresponding ending node. */
  endType(): string {
    if (!this.isOpeningNode()) {
      throw new Error("not an opening node")
    }
    return this.type.replace("open", "") + "close"
  }

  /**
   * Returns the content of the "href" attribute for link tags,
   * null otherwise.
   */
  htmlLinkTarget(): null | string {
    if (this.content == null) {
      return null
    }
    if (this.type !== "htmltag") {
      return null
    }
    const matches = /<a[^>]*href="([^"]*)".*?>/.exec(this.content)
    return matches ? matches[1] : null
  }

  /** Returns whether this AstNode is a closing node. */
  isClosingNode(): boolean {
    return this.type.endsWith("_close")
  }

  /** Returns whether this AstNode is an opening node. */
  isOpeningNode(): boolean {
    return this.type.endsWith("_open")
  }

  get [Symbol.toStringTag]() {
    let result = `${this.type}{`
    if (this.content) {
      result += `"${this.content}"`
    }
    result += `, ${this.attributes}`
    result += `}`
    return result
  }
}
