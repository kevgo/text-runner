import Remarkable from "remarkable"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNodeList } from "../standard-AST/ast-node-list"
import AstStandardizer from "./standardize-ast/ast-standardizer"
import { TransformerCategory } from "./standardize-ast/types/transformer-category"

const markdownParser = new Remarkable("full", { html: true })

/** parses the given Markdown text into the standardized AST format */
export async function parseMarkdownText(
  markdownText: string,
  filepath: AbsoluteFilePath,
  transformerCategories: TransformerCategory[]
): Promise<AstNodeList> {
  // step 1: parse text into Remarkable AST
  const raw = markdownParser.parse(markdownText, {})

  // step 2: convert Remarkable AST into standardized AST
  const astStandardizer = new AstStandardizer(filepath, transformerCategories)
  return astStandardizer.standardize(raw)
}
