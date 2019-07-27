import { AbsoluteFilePath } from "../filesystem/absolute-file-path"
import { AstNodeList } from "./standard-AST/ast-node-list"

/** DocumentsParser is the interface that all parsers (for Markdown, HTML, etc) must implement. */
export interface DocumentsParser {
  /** ParseFiles returns the standard AST for all files with the given paths. */
  parseFiles(filenames: AbsoluteFilePath[]): Promise<AstNodeList[]>

  /** ParseFile returns the standard AST for the files with the given path. */
  parseFile(filename: AbsoluteFilePath): Promise<AstNodeList>

  /** ParseText returns the standard AST for the given document content. */
  parseText(text: string, filepath: AbsoluteFilePath): Promise<AstNodeList>
}
