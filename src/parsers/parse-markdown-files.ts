import color from "colorette"
import fs from "fs-extra"
import { AbsoluteFilePath } from "../filesystem/absolute-file-path"
import { parseMarkdownText } from "./remarkable-based/parse-markdown-text"
import { CustomHtmlTagTransformerCategory } from "./remarkable-based/standardize-ast/custom-html-tags/custom-html-tag-transformer-category"
import { CustomHtmlBlockTransformerCategory } from "./remarkable-based/standardize-ast/custom-htmlblocks/custom-html-block-transformer-category"
import { CustomMdTransformerCategory } from "./remarkable-based/standardize-ast/custom-md/custom-md-transformer-category"
import { GenericHtmlTagTransformerCategory } from "./remarkable-based/standardize-ast/generic-htmltags/generic-html-tag-transformer-category"
import { GenericMdTransformerCategory } from "./remarkable-based/standardize-ast/generic-md/generic-md-transformer-category"
import { TagMapper } from "./remarkable-based/standardize-ast/tag-mapper"
import { TransformerCategory } from "./remarkable-based/standardize-ast/types/transformer-category"
import { AstNodeList } from "./standard-AST/ast-node-list"

export async function parseMarkdownFiles(
  filenames: AbsoluteFilePath[]
): Promise<AstNodeList[]> {
  const promises: Array<Promise<AstNodeList>> = []
  const tagMapper = new TagMapper()
  const transformerCategories = [
    new CustomHtmlBlockTransformerCategory(),
    new CustomHtmlTagTransformerCategory(),
    new GenericHtmlTagTransformerCategory(tagMapper),
    new CustomMdTransformerCategory(),
    new GenericMdTransformerCategory(tagMapper)
  ]
  await Promise.all(transformerCategories.map(tb => tb.loadTransformers()))
  for (const filename of filenames) {
    promises.push(parseMarkdownFile(filename, transformerCategories))
  }
  return Promise.all(promises)
}

/** high-level API of the parser: returns the AST for the file at the given path */
async function parseMarkdownFile(
  filename: AbsoluteFilePath,
  transformerCategories: TransformerCategory[]
): Promise<AstNodeList> {
  const content = await fs.readFile(filename.platformified(), {
    encoding: "utf8"
  })
  if (content.trim().length === 0) {
    console.log(color.magenta("found empty file " + filename.platformified()))
  }
  return parseMarkdownText(content, filename, transformerCategories)
}
