import Remarkable from "remarkable"
import { AbsoluteFilePath } from "../../finding-files/absolute-file-path"
import { AstNodeList } from "../standard-AST/ast-node-list"
import AstStandardizer from "./standardize-ast/ast-standardizer"

const markdownParser = new Remarkable("full", { html: true })

/** parses the given Markdown text into the standardized AST format */
export async function parseMarkdownText(
  markdownText: string,
  filepath: AbsoluteFilePath
): Promise<AstNodeList> {
  // step 1: parse text into Remarkable AST
  const raw = markdownParser.parse(markdownText, {})

  // step 2: convert Remarkable AST into standardized AST
  const astStandardizer = new AstStandardizer(filepath)
  await astStandardizer.loadTransformers()
  return astStandardizer.standardize(raw)
}
