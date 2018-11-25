import chalk from 'chalk'
import AbsoluteFilePath from '../../../domain-model/absolute-file-path'
import UnprintedUserError from '../../../errors/unprinted-user-error'
import AstNode from '../../ast-node'

export default class OpenTagTracker {
  nodes: AstNode[]

  constructor() {
    this.nodes = []
  }

  add(node: AstNode) {
    const existingNode = this.peekType(node.type)
    if (existingNode && existingNode.attributes.textrun) {
      throw new UnprintedUserError(
        `this active block is nested inside another active block of type ${chalk.cyan(
          existingNode.attributes.textrun
        )} on line ${chalk.cyan(existingNode.line.toString())}`,
        node.file.platformified(),
        node.line
      )
    }
    this.nodes.push(node)
  }

  has(nodeType: string): boolean {
    return this.nodes.some(node => node.type === nodeType)
  }

  peek(): AstNode {
    return this.nodes[this.nodes.length - 1]
  }

  peekType(expectedType: string): AstNode | null {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i]
      if (node.type === expectedType) {
        return node
      }
    }
    return null
  }

  popTag(expectedNodeTag: string, file: string, line: number): AstNode {
    if (this.nodes.length === 0) {
      throw new Error(
        `OpenTagTracker is empty while trying to pop tag '${expectedNodeTag}'`
      )
    }
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const result = this.nodes[i]
      if (result.tag !== expectedNodeTag) {
        continue
      }
      this.nodes.splice(i, 1)
      return result
    }
    throw new UnprintedUserError(
      `OpenTagTracker does not have node <${expectedNodeTag}>`,
      file,
      line
    )
  }

  popType(
    expectedNodeType: string,
    file: AbsoluteFilePath,
    line: number
  ): AstNode {
    if (this.nodes.length === 0) {
      throw new Error(
        `No opening tags found while looking for '${expectedNodeType}'`
      )
    }
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const result = this.nodes[i]
      if (result.type !== expectedNodeType) {
        continue
      }
      this.nodes.splice(i, 1)
      return result
    }
    throw new UnprintedUserError(
      `Document should contain <${expectedNodeType}> but does not`,
      file.platformified(),
      line
    )
  }
}
