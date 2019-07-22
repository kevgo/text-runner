import color from "colorette"
import fs from "fs-extra"
import Remarkable from "remarkable"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { Parser } from "../parser"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { AstStandardizer } from "./standardize-ast/ast-standardizer"
import { CustomHtmlTagTransformerBlock } from "./standardize-ast/custom-html-tags/custom-html-tag-transformer-block"
import { CustomHtmlBlockTransformerBlock } from "./standardize-ast/custom-htmlblocks/custom-html-block-transformer-block"
import { CustomMdTransformerBlock } from "./standardize-ast/custom-md/custom-md-transformer-block"
import { GenericHtmlTagTransformerBlock } from "./standardize-ast/generic-htmltags/generic-html-tag-transformer-block"
import { GenericMdTransformerBlock } from "./standardize-ast/generic-md/generic-md-transformer-block"
import { TagMapper } from "./standardize-ast/tag-mapper"
import { TransformerCategory } from "./standardize-ast/types/transformer-category"

export class RemarkableParser implements Parser {
  private readonly remarkable: Remarkable

  private readonly tagMapper: TagMapper

  private readonly transformerCategories: TransformerCategory[]

  constructor() {
    this.remarkable = new Remarkable("full", { html: true })
    this.tagMapper = new TagMapper()
    this.transformerCategories = [
      new CustomHtmlBlockTransformerBlock(),
      new CustomHtmlTagTransformerBlock(),
      new GenericHtmlTagTransformerBlock(this.tagMapper),
      new CustomMdTransformerBlock(),
      new GenericMdTransformerBlock(this.tagMapper)
    ]
  }

  async init() {
    return Promise.all(
      this.transformerCategories.map(tc => tc.loadTransformers())
    )
  }

  async parseFiles(files: AbsoluteFilePath[]): Promise<AstNodeList[]> {
    return Promise.all(files.map(this.parseFile.bind(this)))
  }

  async parseFile(filename: AbsoluteFilePath): Promise<AstNodeList> {
    const content = await fs.readFile(filename.platformified(), {
      encoding: "utf8"
    })
    if (content.trim().length === 0) {
      console.log(color.magenta("found empty file " + filename.platformified()))
      return new AstNodeList()
    }
    return this.parseText(content, filename)
  }

  async parseText(
    markdownText: string,
    filepath: AbsoluteFilePath
  ): Promise<AstNodeList> {
    const raw = this.remarkable.parse(markdownText, {})
    const astStandardizer = new AstStandardizer(
      filepath,
      this.transformerCategories
    )
    return astStandardizer.standardize(raw)
  }
}
