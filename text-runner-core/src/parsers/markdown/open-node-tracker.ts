import { UserError } from "../../errors/user-error"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import * as ast from "../../ast/index"

interface Entry {
  endLine: number
  node: ast.Node
}

/** helps find open MarkdownIt AST nodes */
export class OpenNodeTracker {
  private readonly entries: Entry[]

  constructor() {
    this.entries = []
  }

  /** registers an opening MarkdownIt AST node */
  open(node: ast.Node, endLine: number): void {
    this.entries.push({ node, endLine })
  }

  /** closes the corresponding open ast.Node and returns its endLine */
  close(type: ast.NodeType, file: AbsoluteFilePath, line: number): number {
    const openType = type.replace("_close", "_open")
    for (let i = this.entries.length - 1; i >= 0; i--) {
      if (this.entries[i].node.type === openType) {
        const result = this.entries[i].endLine
        this.entries.splice(i, 1)
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
  has(type: ast.NodeType): boolean {
    for (const entry of this.entries) {
      if (entry.node.type === type) {
        return true
      }
    }
    return false
  }
}
