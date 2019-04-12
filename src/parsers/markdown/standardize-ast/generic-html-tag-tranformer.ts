import { AstNodeList } from "../../ast-node-list";

class GenericHtmlTagTransformer {

  transform(node: any): AstNodeList {
    const tagName = getHtmlBlockTag(
      removeHtmlComments(node.content),
      this.filepath,
      this.line
    )
    let transformed: AstNodeList
    if (tagName.startsWith('/')) {
      // process closing tag
      transformed = this.transformClosingHtmlTag(node, tagName)
    } else {
      // process opening tag
      transformed = this.transformOpeningHtmlTag(node, tagName)
    }

  }
  transformOpeningHtmlTag(node: any, tagName: string): AstNodeList {
    const result = new AstNodeList()
    const [tag, attributes] = parseHtmlTag(
      node.content,
      this.filepath.platformified(),
      this.line
    )
    const type = AstStandardizer.
    const resultNode = new AstNode({
      attributes,
      content: '',
      file: this.filepath,
      line: this.line,
      tag,
      type: this.typeOfTag(tagName)
    })
    this.openTags.add(resultNode)
    result.pushNode(resultNode)
    return result
  }

}
