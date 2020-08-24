import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"

export interface AstNodeAttributes {
  [key: string]: string
}

/** the MarkdownIt node types */
export type AstNodeType =
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
  | "htmltag"
  | "hr"
  | "image"
  | "linebreak"
  | "link_open"
  | "link_close"
  | "text"

/** the HTML tags */
export type AstNodeTag =
  | ""
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

/** a node in the standardized Markdown/HTML AST */
export class AstNode {
  static scaffold(data: any = {}): AstNode {
    if (typeof data.file === "string") {
      data.file = new AbsoluteFilePath(data.file)
    }
    return new AstNode({
      attributes: data.attributes || {},
      content: data.content || "",
      file: data.file || new AbsoluteFilePath("file"),
      line: data.line || 1,
      tag: data.tag != null ? data.tag : "tag",
      type: data.type || "type",
    })
  }

  /** markdown type of AST node */
  type: AstNodeType

  /** HTML type of AST node */
  readonly tag: AstNodeTag

  /** the file in which this AstNode occurs */
  readonly file: AbsoluteFilePath

  /** the line in the file at which this AST node occurs */
  readonly line: number

  /** textual content of this AST node */
  readonly content: string

  /** the attributes of the node */
  readonly attributes: AstNodeAttributes

  constructor(data: {
    type: AstNodeType
    tag: AstNodeTag
    file: AbsoluteFilePath
    line: number
    content: string
    attributes: AstNodeAttributes
  }) {
    this.type = data.type
    this.tag = data.tag
    this.file = data.file
    this.line = data.line
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
    const matches = this.content.match(/<a[^>]*href="([^"]*)".*?>/)
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
