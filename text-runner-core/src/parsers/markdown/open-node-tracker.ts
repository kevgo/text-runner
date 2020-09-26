import { UserError } from "../../errors/user-error"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import * as parser from "./md-parser"
import * as ast from "../../ast/index"

/** helps find open MarkdownIt AST nodes */
export class OpenNodeTracker {
  private readonly nodes: ast.Node[]

  constructor() {
    this.nodes = []
  }

  /** registers an opening MarkdownIt AST node */
  open(node: ast.Node): void {
    this.nodes.push(node)
  }

  /** finds the opening node for the given closing node */
  close(type: ast.NodeType, file: AbsoluteFilePath, line: number): parser.MarkdownItNode {
    const openType = type.replace("_close", "_open")
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const result = this.nodes[i]
      if (result.type === openType) {
        this.nodes.splice(i, 1)
        return result
      }
    }
    throw new UserError(
      `No opening node '${openType}' found for closing node '${type}'`,
      `Node </${openType}> does not have a corresponding opening node`,
      file,
      line
    )
  }

  /** returns whether a node with the given type is open */
  has(type: string): boolean {
    for (const node of this.nodes) {
      if (node.type === type) {
        return true
      }
    }
    return false
  }
}
