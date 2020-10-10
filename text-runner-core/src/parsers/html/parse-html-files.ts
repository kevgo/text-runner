import { promises as fs } from "fs"

import * as ast from "../../ast"
import * as files from "../../filesystem/index"
import { TagMapper } from "../tag-mapper"
import { Parser } from "./html-parser"
import path = require("path")

/** returns the standard AST for the HTML files with the given paths */
export async function parseHTMLFiles(
  filenames: files.FullFile[],
  sourceDir: string,
  tagMapper: TagMapper
): Promise<ast.NodeList[]> {
  const result = []
  const parser = new Parser(tagMapper)
  for (const filename of filenames) {
    const content = await fs.readFile(path.join(sourceDir, filename.platformified()), {
      encoding: "utf8",
    })
    const startingLocation = new files.Location(sourceDir, filename, 1)
    result.push(parser.parse(content, startingLocation))
  }
  return Promise.all(result)
}
