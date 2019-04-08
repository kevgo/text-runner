import { AbsoluteFilePath } from '../../../domain-model/absolute-file-path'
import { UnprintedUserError } from '../../../errors/unprinted-user-error'
import { AstNode } from '../../ast-node'
import { AstNodeList } from '../../ast-node-list'
import { OpenTagTracker } from '../helpers/open-tag-tracker'

/**
 * Transforms basic Remarkable nodes with opening and closing tags
 * to to standardized AST used by TextRunner
 */
export class OpenCloseMdTransformer {
  /**
   * Remarkable node types that we can handle here
   */
  static readonly mappings = {
    'bullet-list': 'ul'
  }

  openTags: OpenTagTracker

  constructor(openTagTracker: OpenTagTracker) {
    this.openTags = openTagTracker
  }

  /**
   * Returns whether this class can transform the given Remarkable node type
   */
  canTransform(tagType: string): boolean {
    const keys = Object.keys(OpenCloseMdTransformer.mappings)
     return keys.includes(tagType+'_open') || keys.includes('tagType+'_close')
  }

  transform(node: any, file: AbsoluteFilePath, line: number): AstNodeList {
    if (this.isOpeningType(node.type)) {
      return this.transformOpeningNode(node, file, line)
    }
    if (this.isClosingType(node.type)) {
      return this.transformClosingNode(node, file, line)
    }
    return this.transformStandaloneNode(node, file, line)
  }

  /**
   * Returns whether the given Remarkable node type describes an opening tag
   */
  isOpeningType(nodeType: string): boolean {
    return nodeType.endsWith('_open')
  }

  /**
   * Returns whether the given Remarkable node type describes a closing tag
   */
  isClosingType(nodeType: string): boolean {
    return nodeType.endsWith('_close')
  }

  /**
   * Transforms a simple opening Remarkable Node
   */
  transformOpeningNode(
    node: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    const resultNode = new AstNode({
      attributes: {},
      content: '',
      file,
      line,
      tag: this.openingTagFor(node.type, file, line),
      type: node.type
    })
    this.openTags.add(resultNode)
    result.pushNode(resultNode)
    return result
  }

  transformClosingNode(
    node: any,
    file: AbsoluteFilePath,
    line: number
  ): AstNodeList {
    const result = new AstNodeList()
    const openingNodeType = this.openingTypeFor(node.type, file, line)
    const openNode = this.openTags.popType(openingNodeType, file, line)
    result.pushNode({
      attributes: openNode.attributes,
      content: '',
      file,
      line,
      tag: this.closingTagFor(node.type),
      type: node.type
    })
    return result
  }

  /**
   * Returns the opening HTML tag name for the given Remarkable node type
   */
  openingTagFor(
    nodeType: string,
    file: AbsoluteFilePath,
    line: number
  ): string {
    if (nodeType.endsWith('_open')) {
      const genericNodeType = nodeType.replace('_open', '')
      return MdTransformer.simpleOpeningClosingTags[genericNodeType]
    }
    throw new UnprintedUserError(
      `Cannot determine opening tag for ${nodeType}`,
      file.platformified(),
      line
    )
  }

  openingTypeFor(nodeType: string, file: AbsoluteFilePath, line: number) {}

  /**
   * Returns the closing type for the given opening type
   */
  closingTypeFor(openingType: string): string {
    return openingType.replace('_close', '_open')
  }
}
