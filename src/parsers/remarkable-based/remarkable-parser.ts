import fs from "fs-extra"
import { AbsoluteFilePath } from "../../finding-files/absolute-file-path"
import { AstNodeList } from "../standard-AST/ast-node-list"

export class RemarkableParser implements Parser {
  async parseFiles(files: AbsoluteFilePath[]): Promise<AstNodeList[]> {
    return Promise.all(files.map(this.parseFile.bind(this)))
  }

  async parseFile(filename: AbsoluteFilePath): Promise<AstNodeList> {
    const content = await fs.readFile(filename.platformified(), {
      encoding: "utf8"
    })
    if (content.trim().length === 0) {
      console.log(color.magenta("found empty file " + filename.platformified()))
    }
    return parseMarkdownText(content, filename)
  }

  async parseMarkdownText(
    markdownText: string,
    filepath: AbsoluteFilePath
  ): Promise<AstNodeList> {
    const raw = this.markdownParser.parse(markdownText, {})
    const astStandardizer = new AstStandardizer(filepath)
    await astStandardizer.loadTransformers()
    return astStandardizer.standardize(raw)
  }
}
