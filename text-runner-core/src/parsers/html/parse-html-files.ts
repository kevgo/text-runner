import { promises as fs } from "fs"

import * as ast from "../../ast/index.js"
import * as files from "../../filesystem/index.js"
import { TagMapper } from "../tag-mapper.js"
import { Parser } from "./html-parser.js"

/** returns the standard AST for the HTML files with the given paths */
export async function parseHTMLFiles(
  filenames: files.FullFilePath[],
  sourceDir: files.SourceDir,
  tagMapper: TagMapper
): Promise<ast.NodeList[]> {
  const result = []
  const parser = new Parser(tagMapper)
  for (const filename of filenames) {
    const content = await fs.readFile(sourceDir.joinFullFile(filename).platformified(), {
      encoding: "utf8"
    })
    result.push(parser.parse(content, new files.Location(sourceDir, filename, 1)))
  }
  return Promise.all(result)
}
