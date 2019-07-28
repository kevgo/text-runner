import fs from "fs-extra"
import parse5 from "parse5"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { DocumentsParser } from "../document-parser"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { HtmlAstStandardizer } from "./html-ast-standardizer"

export class HTMLParser implements DocumentsParser {
  standardizer: HtmlAstStandardizer

  constructor() {
    this.standardizer = new HtmlAstStandardizer()
  }

  async parseFiles(filenames: AbsoluteFilePath[]): Promise<AstNodeList[]> {
    const result = []
    for (const filename of filenames) {
      result.push(this.parseFile(filename))
    }
    return Promise.all(result)
  }

  async parseFile(filename: AbsoluteFilePath): Promise<AstNodeList> {
    const content = await fs.readFile(filename.platformified(), {
      encoding: "utf8"
    })
    return this.parseInline(content, filename, 1, false)
  }

  parseInline(
    text: string,
    file: AbsoluteFilePath,
    startingLine: number,
    inline: boolean
  ): AstNodeList {
    const htmlAst = parse5.parse(text, {
      sourceCodeLocationInfo: true
    })
    return this.standardizer.standardizeDocument(
      htmlAst,
      file,
      startingLine,
      inline
    )
  }
}
