import { AbsoluteFilePath } from '../../../domain-model/absolute-file-path'
import { AstNodeList } from '../../ast-node-list'
import { getHtmlBlockTag } from '../helpers/get-html-block-tag'
import { parseHtmlTag } from '../helpers/parse-html-tag'
import { removeHtmlComments } from '../helpers/remove-html-comments'

export class GenericHtmlTagTransformer {
  transform(node: any, filepath: AbsoluteFilePath, line: number): AstNodeList {
    const sanitizedContent = removeHtmlComments(node.content)
    const tagName = getHtmlBlockTag(sanitizedContent, filepath, line)
    if (tagName.startsWith('/')) {
      return this.transformClosingHtmlTag(node, filepath, line)
    } else {
      return this.transformOpeningHtmlTag(node, tagName)
    }
  }

  transformOpeningHtmlTag(
    node: any,
    filepath: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    const [tag, attributes] = parseHtmlTag(
      node.content,
      filepath.platformified(),
      line
    )
    const resultNode = new AstNode({
      attributes,
      content: '',
      file: this.filepath,
      line: this.line,
      tag,
      type: this.typeOfTag(tagName)
    })
    openTags.add(resultNode)
    result.pushNode(resultNode)
    return result
  }
}
