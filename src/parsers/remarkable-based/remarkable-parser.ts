import color from "colorette"
import fs from "fs-extra"
import Remarkable from "remarkable"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { DocumentsParser } from "../document-parser"
import { AstNodeList } from "../standard-AST/ast-node-list"
import AstStandardizer from "./standardize-ast/ast-standardizer"
import { CustomHtmlTagTransformerCategory } from "./standardize-ast/custom-html-tags/custom-html-tag-transformer-category"
import { CustomHtmlBlockTransformerCategory } from "./standardize-ast/custom-htmlblocks/custom-html-block-transformer-category"
import { CustomMdTransformerCategory } from "./standardize-ast/custom-md/custom-md-transformer-category"
import { GenericHtmlTagTransformerCategory } from "./standardize-ast/generic-htmltags/generic-html-tag-transformer-category"
import { GenericMdTransformerCategory } from "./standardize-ast/generic-md/generic-md-transformer-category"
import { TagMapper } from "./standardize-ast/tag-mapper"
import { TransformerCategory } from "./standardize-ast/types/transformer-category"

/** RemarkableParser is a DocumentsParser that parses Markdown. */
export class RemarkableParser implements DocumentsParser {
  remarkable: Remarkable
  tagMapper: TagMapper
  transformerCategories: TransformerCategory[]

  constructor() {
    this.tagMapper = new TagMapper()
    this.remarkable = new Remarkable("full", { html: true })
    this.transformerCategories = [
      new CustomHtmlBlockTransformerCategory(),
      new CustomHtmlTagTransformerCategory(),
      new GenericHtmlTagTransformerCategory(this.tagMapper),
      new CustomMdTransformerCategory(),
      new GenericMdTransformerCategory(this.tagMapper)
    ]
  }

  async init() {
    await Promise.all(
      this.transformerCategories.map(tc => tc.loadTransformers())
    )
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
    if (content.trim().length === 0) {
      console.log(color.magenta("found empty file " + filename.platformified()))
    }
    return this.parseText(content, filename)
  }

  async parseText(
    markdownText: string,
    filepath: AbsoluteFilePath
  ): Promise<AstNodeList> {
    // step 1: parse text into Remarkable AST
    const raw = this.remarkable.parse(markdownText, {})

    // step 2: convert Remarkable AST into standardized AST
    const astStandardizer = new AstStandardizer(
      filepath,
      this.transformerCategories
    )
    return astStandardizer.standardize(raw)
  }
}
