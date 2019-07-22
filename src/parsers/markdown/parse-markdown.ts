import Remarkable from "remarkable"
import { AbsoluteFilePath } from "../../finding-files/absolute-file-path"
import { AstNodeList } from "../standard-AST/ast-node-list"
import AstStandardizer from "./standardize-ast/ast-standardizer"

const markdownParser = new Remarkable("full", { html: true })

/** parses the given Markdown text into an AstNodeList */
export async function parseMarkdown(
  markdownText: string,
  filepath: AbsoluteFilePath
): Promise<AstNodeList> {
  const raw = markdownParser.parse(markdownText, {})
  const astStandardizer = new AstStandardizer(filepath)
  await astStandardizer.loadTransformers()
  return astStandardizer.standardize(raw)
}
