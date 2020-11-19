import * as files from "../filesystem/index"

export type NodeAttributes = Record<string, string>

/** the MarkdownIt node types */
export type NodeType =
  | "anchor_open"
  | "anchor_close"
  | "bold_open"
  | "bold_close"
  | "bullet_list_open"
  | "bullet_list_close"
  | "code_open"
  | "code_close"
  | "fence_open"
  | "fence_close"
  | "h1_open"
  | "h1_close"
  | "h2_open"
  | "h2_close"
  | "h3_open"
  | "h3_close"
  | "h4_open"
  | "h4_close"
  | "h5_open"
  | "h5_close"
  | "h6_open"
  | "h6_close"
  | "heading_open"
  | "heading_close"
  | "htmltag"
  | "hr"
  | "image"
  | "linebreak"
  | "link_open"
  | "link_close"
  | "paragraph_open"
  | "paragraph_close"
  | "text" // text node

/** the HTML tags */
export type NodeTag =
  | "" // text node
  | "a"
  | "/a"
  | "b"
  | "/b"
  | "br"
  | "code"
  | "/code"
  | "hr"
  | "i"
  | "img"
  | "li"
  | "ol"
  | "p"
  | "pre"
  | "/pre"
  | "ul"

export interface NodeScaffoldData {
  readonly attributes?: NodeAttributes
  readonly content?: string
  file?: string | files.FullFilePath
  readonly line?: number
  readonly sourceDir?: string
  readonly tag?: NodeTag
  readonly type?: NodeType
}

/** a node in the standardized Markdown/HTML AST */
export class Node {
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
      type: data.type || "hr",
    })
  }

  /** markdown type of AST node */
  type: NodeType

  /** HTML type of AST node */
  readonly tag: NodeTag

  /** the file in which this AstNode occurs */
  readonly location: files.Location

  /** textual content of this AST node */
  readonly content: string

  /** the attributes of the node */
  readonly attributes: NodeAttributes

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
  htmlLinkTarget(): string | null {
    if (this.content == null) {
      return null
    }
    if (this.type !== "htmltag") {
      return null
    }
    const matches = /<a[^>]*href="([^"]*)".*?>/.exec(this.content)
    return matches ? matches[1] : null
  }

  /** Returns whether this AstNode is an opening node. */
  isOpeningNode(): boolean {
    return this.type.endsWith("_open")
  }

  /** Returns whether this AstNode is a closing node. */
  isClosingNode(): boolean {
    return this.type.endsWith("_close")
  }
}
