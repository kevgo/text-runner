import * as ast from "../ast/node.js"

type TypeTagMapping = Map<ast.NodeType, ast.NodeTag>
type TagTypeMapping = Map<ast.NodeTag, ast.NodeType>

/**
 * TagMapper maps MarkdownIt node types to HTML tags and vice versa.
 *
 * MarkdownIt node types: bold_open, bold_close, image, explicitly
 * Tag types: "b", "/b", "img", etc
 */
export class TagMapper {
  /** tags that have opening and closing versions */
  private static readonly OPEN_CLOSE_MAPPINGS = new Map<string, ast.NodeTag>([
    ["bold", "b"],
    ["bullet_list", "ul"],
    ["fence", "pre"],
    ["italic", "i"],
    ["link", "a"],
    ["list_item", "li"],
    ["ordered_list", "ol"],
    ["paragraph", "p"],
  ])

  /** tags that stand alone, i.e. have no opening and closing versions */
  private static readonly STANDALONE_MAPPINGS: TypeTagMapping = new Map([
    ["hr", "hr"],
    ["image", "img"],
    ["linebreak", "br"],
  ])

  /** maps MarkdownIt types to their corresponding HTML tags */
  private readonly typeTagMappings: TypeTagMapping

  /** maps HTML tag names to their corresponding MarkdownIt types */
  private readonly tagTypeMappings: TagTypeMapping

  constructor() {
    this.typeTagMappings = this.createTypeTagMappings()
    this.tagTypeMappings = this.createTagTypeMappings()
  }

  isOpenCloseTag(tagName: ast.NodeTag): boolean {
    if (tagName === "") {
      return false
    }
    return !this.isStandaloneTag(tagName)
  }

  isStandaloneTag(tagName: string): boolean {
    for (const value of TagMapper.STANDALONE_MAPPINGS.values()) {
      if (value === tagName) {
        return true
      }
    }
    return false
  }

  /** Returns the opening MarkdownIt type for the given HTML tag. */
  openingTypeForTag(tagName: ast.NodeTag, attributes: ast.NodeAttributes): ast.NodeType {
    return this.typeForTag(tagName.replace(/^\//, "") as ast.NodeTag, attributes)
  }

  /** Returns the HTML tag for the given MarkdownIt type. */
  tagForType(type: ast.NodeType): ast.NodeTag {
    // handle text tag
    if (type === "text") {
      return ""
    }

    // handle explicitly mapped values
    const result = this.typeTagMappings.get(type)
    if (result) {
      return result
    }

    // handle generic opening tag
    if (type.endsWith("_open")) {
      return type.substring(0, type.length - 5) as ast.NodeTag
    }

    // handle generic closing tag
    if (type.endsWith("_close")) {
      return ("/" + type.substring(0, type.length - 6)) as ast.NodeTag
    }

    // handle generic stand-alone tag
    return type as ast.NodeTag
  }

  /** Returns the Markdown node type for the given HTML tag. */
  typeForTag(tag: ast.NodeTag, attributes: ast.NodeAttributes): ast.NodeType {
    // distinguish anchors from links
    if (tag === "a" && !attributes.href) {
      return "anchor_open"
    }
    if (tag === "/a" && !attributes.href) {
      return "anchor_close"
    }

    // check for known tags
    const result = this.tagTypeMappings.get(tag)
    if (result) {
      return result
    }

    // here it is an unknown tag, we assume it is opening-closing
    if (tag.startsWith("/")) {
      return (tag.substring(1) + "_close") as ast.NodeType
    } else {
      return (tag + "_open") as ast.NodeType
    }
  }

  /** Calculates the mappings from MarkdownIt types to HTML tags */
  private createTypeTagMappings(): TypeTagMapping {
    const result: TypeTagMapping = new Map()
    for (const [type, tag] of TagMapper.OPEN_CLOSE_MAPPINGS) {
      result.set((type + "_open") as ast.NodeType, tag)
      result.set((type + "_close") as ast.NodeType, ("/" + tag) as ast.NodeTag)
    }
    for (const [type, tag] of TagMapper.STANDALONE_MAPPINGS) {
      result.set(type, tag)
    }
    return result
  }

  /** Calculates the mappings from HTML tags to MarkdownIt types */
  private createTagTypeMappings(): TagTypeMapping {
    const result: TagTypeMapping = new Map()
    for (const [type, tag] of this.typeTagMappings) {
      result.set(tag, type)
    }
    return result
  }
}
