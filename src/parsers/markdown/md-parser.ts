import fs from "fs-extra"
import MarkdownIt from "markdown-it"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { DocumentsParser } from "../document-parser"
import { AstNodeList } from "../standard-AST/ast-node-list"
import MarkdownItAstStandardizer from "./markdown-it-ast-standardizer"

/** MarkdownParser is a DocumentsParser that parses Markdown. */
export class MdParser implements DocumentsParser {
  /** Markdown parser instance */
  private readonly markdownIt: MarkdownIt

  constructor() {
    this.markdownIt = new MarkdownIt({
      html: true,
      linkify: false
    })
  }

  async parseFiles(filenames: AbsoluteFilePath[]): Promise<AstNodeList[]> {
    const promises: Array<Promise<AstNodeList>> = []
    for (const filename of filenames) {
      promises.push(this.parseFile(filename))
    }
    return Promise.all(promises)
  }

  async parseFile(filename: AbsoluteFilePath): Promise<AstNodeList> {
    const content = await fs.readFile(filename.platformified(), {
      encoding: "utf8"
    })
    return this.parseText(content, filename)
  }

  async parseText(
    markdownText: string,
    filepath: AbsoluteFilePath
  ): Promise<AstNodeList> {
    // step 1: parse the text into the Markdown AST
    const raw = this.markdownIt.parse(markdownText, {})

    // step 2: convert Remarkable AST into standardized AST
    const astStandardizer = new MarkdownItAstStandardizer(raw, filepath)
    return astStandardizer.standardized()
  }
}
