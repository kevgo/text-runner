import { AbsoluteFilePath } from '../../domain-model/absolute-file-path'
import { AstNodeList } from '../ast-node-list'
import AstStandardizer from './standardize-ast/ast-standardizer'

export class MarkdownParser {
  astStandardizer: AstStandardizer

  /** Parses the file with the given path into an AstNodeList  */
  async readAndParseFile(filepath: AbsoluteFilePath): AstNodeList {}

  async readAndParseFiles(filepaths: AbsoluteFilePath[]): AstNodeList[] {
    const result: AstNodeList[] = []
    for (const filepath of filepaths) {
      const nodeList = await this.readAndParseFile(filepath)
      result.push(nodeList)
    }
    return result
  }
}
