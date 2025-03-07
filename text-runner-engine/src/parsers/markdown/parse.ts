import { promises as fs } from "fs"

import * as ast from "../../ast/index.js"
import * as files from "../../filesystem/index.js"
import { MarkdownParser } from "./md-parser.js"

/** returns the standard AST for the Markdown files given as paths relative to the given sourceDir */
export async function parse(filenames: files.FullFilePath[], sourceDir: files.SourceDir): Promise<ast.NodeList[]> {
  const result: ast.NodeList[] = []
  const parser = new MarkdownParser()
  for (const filename of filenames) {
    const content = await fs.readFile(sourceDir.joinStr(filename.platformified()), {
      encoding: "utf8"
    })
    result.push(parser.parse(content, sourceDir, filename))
  }
  return result
}
