import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import * as ast from "../../ast"
import { TagMapper } from "../tag-mapper"

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

  parse(tag: string, file: AbsoluteFilePath, line: number): ast.NodeList {
    const match = tag.match(this.closingTagRE)
    if (!match) {
      throw new Error(`no tag parsed in ${tag}`)
    }
    const tagName = match[1].replace(/ /g, "") as ast.NodeTag
    const result = new ast.NodeList()
    result.push(
      new ast.Node({
        attributes: {},
        content: "",
        file,
        line,
        tag: tagName,
        type: this.tagMapper.typeForTag(tagName, {}),
      })
    )
    return result
  }
}
