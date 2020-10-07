import { promises as fs } from "fs"

import * as ast from "../../ast"
import { FullPath } from "../../filesystem/full-path"
import { MarkdownParser } from "./md-parser"
import path = require("path")

/** returns the standard AST for the Markdown files given as paths relative to the given sourceDir */
export async function parse(filenames: FullPath[], sourceDir: string): Promise<ast.NodeList[]> {
  const result: ast.NodeList[] = []
  const parser = new MarkdownParser()
  for (const filename of filenames) {
    const content = await fs.readFile(path.join(sourceDir, filename.platformified()), {
      encoding: "utf8",
    })
    result.push(parser.parse(content, filename))
  }
  return result
}
