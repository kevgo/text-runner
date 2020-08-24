import { AstNodeAttributes, AstNodeType, AstNodeTag } from "./standard-AST/ast-node"

type TypeTagMapping = Map<AstNodeType, AstNodeTag>
type TagTypeMapping = Map<AstNodeTag, AstNodeType>

/**
 * TagMapper maps MarkdownIt node types to HTML tags and vice versa.
 *
 * MarkdownIt node types: bold_open, bold_close, image, explicitly
 * Tag types: "b", "/b", "img", etc
 */
export class TagMapper {
  /** tags that have opening and closing versions */
  private static readonly OPEN_CLOSE_MAPPINGS = new Map<string, AstNodeTag>([
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

  isOpenCloseTag(tagName: AstNodeTag): boolean {
    if (tagName === "") {
      return false
    }
    return !this.isStandaloneTag(tagName)
  }

  isStandaloneTag(tagName: AstNodeTag): boolean {
    for (const value of TagMapper.STANDALONE_MAPPINGS.values()) {
      if (value === tagName) {
        return true
      }
    }
    return false
  }

  /** Returns the opening MarkdownIt type for the given HTML tag. */
  openingTypeForTag(tagName: AstNodeTag, attributes: AstNodeAttributes) {
    return this.typeForTag(tagName.replace(/^\//, "") as AstNodeTag, attributes)
  }

  /** Returns the HTML tag for the given MarkdownIt type. */
  tagForType(type: AstNodeType): AstNodeTag {
    // handle text tag
    if (type === "text") {
      return ""
    }

    // handle explicitly mapped values
    // TODO: remove if to simplify
    if (this.typeTagMappings.has(type)) {
      const result = this.typeTagMappings.get(type)
      if (result) {
        return result
      }
    }

    // handle generic opening tag
    if (type.endsWith("_open")) {
      return type.substring(0, type.length - 5) as AstNodeTag
    }

    // handle generic closing tag
    if (type.endsWith("_close")) {
      return ("/" + type.substring(0, type.length - 6)) as AstNodeTag
    }

    // handle generic stand-alone tag
    return type as AstNodeTag
  }

  /** Returns the Markdown node type for the given HTML tag. */
  typeForTag(tag: AstNodeTag, attributes: AstNodeAttributes): AstNodeType {
    // distinguish anchors from links
    if (tag === "a" && !attributes.href) {
      return "anchor_open"
    }
    if (tag === "/a" && !attributes.href) {
      return "anchor_close"
    }

    // check for known tags
    // TODO: remove if
    if (this.tagTypeMappings.has(tag)) {
      const result = this.tagTypeMappings.get(tag)
      if (result) {
        return result
      }
    }

    // here it is an unknown tag, we assume it is opening-closing
    if (tag.startsWith("/")) {
      return (tag.substring(1) + "_close") as AstNodeType
    } else {
      return (tag + "_open") as AstNodeType
    }
  }

  /** Calculates the mappings from MarkdownIt types to HTML tags */
  private createTypeTagMappings(): TypeTagMapping {
    const result: TypeTagMapping = new Map()
    for (const [type, tag] of TagMapper.OPEN_CLOSE_MAPPINGS) {
      result.set((type + "_open") as AstNodeType, tag)
      result.set((type + "_close") as AstNodeType, ("/" + tag) as AstNodeTag)
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
