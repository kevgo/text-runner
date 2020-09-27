import { promises as fs } from "fs"

import * as ast from "../../ast"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { TagMapper } from "../tag-mapper"
import { Parser } from "./html-parser"
import path = require("path")

/** returns the standard AST for the HTML files with the given paths */
export async function parseHTMLFiles(
  filenames: AbsoluteFilePath[],
  sourceDir: string,
  tagMapper: TagMapper
): Promise<ast.NodeList[]> {
  const result = []
  const parser = new Parser(tagMapper)
  for (const filename of filenames) {
    const content = await fs.readFile(path.join(sourceDir, filename.platformified()), {
      encoding: "utf8",
    })
    result.push(parser.parse(content, filename, 1))
  }
  return Promise.all(result)
}
