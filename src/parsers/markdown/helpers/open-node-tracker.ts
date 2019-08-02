import { UnprintedUserError } from "../../../errors/unprinted-user-error"
import { AbsoluteFilePath } from "../../../filesystem/absolute-file-path"

/** helps find open MarkdownIt AST nodes */
export class OpenNodeTracker {
  private readonly nodes: any[]

  constructor() {
    this.nodes = []
  }

  /** registers an opening MarkdownIt AST node */
  open(node: any) {
    this.nodes.push(node)
  }

  /** finds the opening node for the given closing node */
  close(node: any, file: AbsoluteFilePath, line: number): any {
    const openType = node.type.replace("_close", "_open")
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const result = this.nodes[i]
      if (result.type === openType) {
        this.nodes.splice(i, 1)
        return result
      }
    }
    throw new UnprintedUserError(
      `No opening node '${openType}' found for closing node '${node.type}'`,
      file.platformified(),
      line
    )
  }
}
