import fs from "fs-extra"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { MarkdownParser } from "./md-parser"

/** returns the standard AST for the Markdown files with the given paths */
export async function parseMarkdownFiles(filenames: AbsoluteFilePath[]): Promise<AstNodeList[]> {
  const result: AstNodeList[] = []
  const parser = new MarkdownParser()
  for (const filename of filenames) {
    const content = await fs.readFile(filename.platformified(), {
      encoding: "utf8"
    })
    result.push(parser.parse(content, filename))
  }
  return result
}
