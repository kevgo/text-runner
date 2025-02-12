import * as ast from "../../ast/index.js"
import * as files from "../../filesystem/index.js"
import { TagMapper } from "../tag-mapper.js"

/** ClosingTagParser parses HTML blocks containing just a closing tag. */
export class ClosingTagParser {
  private readonly closingTagRE: RegExp

  private readonly tagMapper: TagMapper

  constructor(tagMapper: TagMapper) {
    this.closingTagRE = /^\s*<[ ]*(\/[ ]*\w+)[ ]*>\s*$/
    this.tagMapper = tagMapper
  }

  /** Returns whether the given tag is a closing tag */
  isClosingTag(tag: string): boolean {
    return this.closingTagRE.test(tag)
  }

  parse(tag: string, location: files.Location): ast.NodeList {
    const match = this.closingTagRE.exec(tag)
    if (!match) {
      throw new Error(`no tag parsed in ${tag}`)
    }
    const tagName = match[1].replace(/ /g, "") as ast.NodeTag
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: {},
        content: "",
        location,
        tag: tagName,
        type: this.tagMapper.typeForTag(tagName, {}),
      }),
    )
    return result
  }
}
