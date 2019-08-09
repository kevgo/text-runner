import { AstNodeAttributes } from "./standard-AST/ast-node"

/** Mappings from Remarkable types to HTML tag names or vice versa. */
interface Mappings {
  [key: string]: string
}

/**
 * TagMapper maps Remarkable node types to HTML tags and vice versa.
 *
 * Remarkable node types: bold_open, bold_close, image, explicitly
 * Tag types: "b", "/b", "img", etc
 */
export class TagMapper {
  /** Mappings of tags that have opening and closing varieties. */
  private static readonly OPEN_CLOSE_MAPPINGS: Mappings = {
    bold: "b",
    bullet_list: "ul",
    fence: "pre",
    italic: "i",
    linebreak: "br",
    link: "a",
    list_item: "li",
    ordered_list: "ol",
    paragraph: "p"
  }

  /** Mappings of tags that stand alone, i.e. have no opening and closing varieties. */
  private static readonly STANDALONE_MAPPINGS: Mappings = {
    hardbreak: "br",
    hr: "hr",
    image: "img"
  }

  /** Maps Remarkable types to their corresponding HTML tags */
  private readonly typeTagMappings: Mappings

  /** Maps HTML tag names to their corresponding Remarkable types */
  private readonly tagTypeMappings: Mappings

  constructor() {
    this.typeTagMappings = this.createTypeTagMappings()
    this.tagTypeMappings = this.createTagTypeMappings()
  }

  isOpenCloseTag(tagName: string): boolean {
    if (tagName === "#text") {
      return false
    }
    return !this.isStandaloneTag(tagName)
  }

  isStandaloneTag(tagName: string): boolean {
    return Object.values(TagMapper.STANDALONE_MAPPINGS).includes(tagName)
  }

  /** Returns the opening Remarkable type for the given HTML tag. */
  openingTypeForTag(tagName: string, attributes: AstNodeAttributes) {
    return this.typeForTag(tagName.replace(/^\//, ""), attributes)
  }

  /** Returns the HTML tag for the given Remarkable type. */
  tagForType(type: string): string {
    // handle text tag
    if (type === "text") {
      return ""
    }

    // handle explicitly mapped values
    if (this.typeTagMappings.hasOwnProperty(type)) {
      return this.typeTagMappings[type]
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
  typeForTag(tag: string, attributes: AstNodeAttributes): string {
    // distinguish anchors from links
    if (tag === "a" && !attributes.href) {
      return "anchor_open"
    }
    if (tag === "/a" && !attributes.href) {
      return "anchor_close"
    }

    // check for known tags
    if (this.tagTypeMappings.hasOwnProperty(tag)) {
      return this.tagTypeMappings[tag]
    }

    // here it is an unknown tag, we assume it is opening-closing
    if (tag.startsWith("/")) {
      return tag.substring(1) + "_close"
    } else {
      return tag + "_open"
    }
  }

  /** Calculates the mappings from Remarkable types to HTML tags */
  private createTypeTagMappings(): Mappings {
    const result: Mappings = {}
    for (const [type, tag] of Object.entries(TagMapper.OPEN_CLOSE_MAPPINGS)) {
      result[type + "_open"] = tag
      result[type + "_close"] = "/" + tag
    }
    for (const [type, tag] of Object.entries(TagMapper.STANDALONE_MAPPINGS)) {
      result[type] = tag
    }
    return result
  }

  /** Calculates the mappings from HTML tags to Remarkable types */
  private createTagTypeMappings(): Mappings {
    const result: Mappings = {}
    for (const [type, tag] of Object.entries(this.typeTagMappings)) {
      result[tag] = type
    }
    return result
  }
}
