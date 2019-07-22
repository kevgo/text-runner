import { AbsoluteFilePath } from "../filesystem/absolute-file-path"
import { AstNodeList } from "./standard-AST/ast-node-list"

/** Parses defines the interface that all parsers have to conform to */
export interface Parser {
  /** ParseAll returns the standard AST for all given files */
  parseFiles(files: AbsoluteFilePath[]): AstNodeList[]
}
