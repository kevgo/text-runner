import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNodeList } from "../standard-AST/ast-node-list"

/**
 * MarkdownItAstStandardizer converts an AST created by MarkdownIt
 * into the standardized AST format.
 */
export default class MarkdownItAstStandardizer {
  /** the MarkdownIt AST to convert */
  mdAst: any

  /** the path of the file from which the MarkdownIt AST is from */
  filepath: AbsoluteFilePath

  constructor(mdAST: any, filepath: AbsoluteFilePath) {
    this.mdAst = mdAST
    this.filepath = filepath
  }

  /** returns the standardized AST for the MarkdownIt-based AST given in the constructor */
  standardized(): AstNodeList {
    return this.standardizeAST(this.mdAst, 1)
  }

  /** Converts the given MarkdownIt AST into the standard AST format */
  private standardizeAST(mdAST: any, parentLine: number) {
    const result = new AstNodeList()
    for (const node of mdAST) {
      // determine the current line we are on
      let currentLine = Math.max(parentLine, (node.map || [])[0])

      // handle node with children
      if (node.children) {
        const standardizedChildNodes = this.standardizeAST(
          node.children,
          currentLine
        )
        result.push(...standardizedChildNodes)
        continue
      }

      // handle softbreak
      if (this.isSoftBreak(node)) {
        currentLine += 1
        continue
      }

      // handle node without children
      const standardizedNode = this.standardizeNode(node)
      result.push(...standardizedNode)
    }
    return result
  }

  /** Returns the standardized version of the given MarkdownIt node */
  private standardizeNode(mdNode: any): AstNodeList {
    const result = new AstNodeList()
    console.log(mdNode)
    return result
  }

  private isSoftBreak(node: any): boolean {
    return node.type === "softbreak"
  }
}
