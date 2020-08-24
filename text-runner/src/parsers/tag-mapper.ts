import { AstNodeAttributes, AstNodeTypes, AstNodeTags } from "./standard-AST/ast-node"

type TypeTagMapping = Map<AstNodeTypes, AstNodeTags>
type TagTypeMapping = Map<AstNodeTags, AstNodeTypes>

/**
 * TagMapper maps Remarkable node types to HTML tags and vice versa.
 *
 * Remarkable node types: bold_open, bold_close, image, explicitly
 * Tag types: "b", "/b", "img", etc
 */
export class TagMapper {
  /** Mappings of tags that have opening and closing varieties. */
  private static readonly OPEN_CLOSE_MAPPINGS = new Map<string, AstNodeTags>([
    ["bold", "b"],
    ["bullet_list", "ul"],
    ["fence", "pre"],
    ["italic", "i"],
    ["link", "a"],
    ["list_item", "li"],
    ["ordered_list", "ol"],
    ["paragraph", "p"],
  ])

  /** Mappings of tags that stand alone, i.e. have no opening and closing varieties. */
  private static readonly STANDALONE_MAPPINGS: TypeTagMapping = new Map([
    ["hr", "hr"],
    ["image", "img"],
    ["linebreak", "br"],
  ])

  /** Maps Remarkable types to their corresponding HTML tags */
  private readonly typeTagMappings: TypeTagMapping

  /** Maps HTML tag names to their corresponding Remarkable types */
  private readonly tagTypeMappings: TagTypeMapping

  constructor() {
    this.typeTagMappings = this.createTypeTagMappings()
    this.tagTypeMappings = this.createTagTypeMappings()
  }

  isOpenCloseTag(tagName: AstNodeTags): boolean {
    if (tagName === "") {
      return false
    }
    return !this.isStandaloneTag(tagName)
  }

  isStandaloneTag(tagName: AstNodeTags): boolean {
    return Object.values(TagMapper.STANDALONE_MAPPINGS).includes(tagName)
  }

  /** Returns the opening Remarkable type for the given HTML tag. */
  openingTypeForTag(tagName: AstNodeTags, attributes: AstNodeAttributes) {
    return this.typeForTag(tagName.replace(/^\//, "") as AstNodeTags, attributes)
  }

  /** Returns the HTML tag for the given Remarkable type. */
  tagForType(type: AstNodeTypes): string {
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
      return type.substring(0, type.length - 5)
    }

    // handle generic closing tag
    if (type.endsWith("_close")) {
      return "/" + type.substring(0, type.length - 6)
    }

    // handle generic stand-alone tag
    return type
  }

  /** Returns the Markdown node type for the given HTML tag. */
  typeForTag(tag: AstNodeTags, attributes: AstNodeAttributes): AstNodeTypes {
    // distinguish anchors from links
    if (tag === "a" && !attributes.href) {
      return "anchor_open"
    }
    if (tag === "/a" && !attributes.href) {
      return "anchor_close"
    }

    // check for known tags
    if (this.tagTypeMappings.has(tag)) {
      const result = this.tagTypeMappings.get(tag)
      if (result) {
        return result
      }
    }

    // here it is an unknown tag, we assume it is opening-closing
    if (tag.startsWith("/")) {
      return (tag.substring(1) + "_close") as AstNodeTypes
    } else {
      return (tag + "_open") as AstNodeTypes
    }
  }

  /** Calculates the mappings from Remarkable types to HTML tags */
  private createTypeTagMappings(): TypeTagMapping {
    const result: TypeTagMapping = new Map()
    for (const [type, tag] of TagMapper.OPEN_CLOSE_MAPPINGS) {
      result.set((type + "_open") as AstNodeTypes, tag)
      result.set((type + "_close") as AstNodeTypes, ("/" + tag) as AstNodeTags)
    }
    for (const [type, tag] of TagMapper.STANDALONE_MAPPINGS) {
      result.set(type, tag)
    }
    return result
  }

  /** Calculates the mappings from HTML tags to Remarkable types */
  private createTagTypeMappings(): TagTypeMapping {
    const result: TagTypeMapping = new Map()
    for (const [type, tag] of this.typeTagMappings) {
      result.set(tag, type)
    }
    return result
  }
}
