import fs from "fs-extra"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { TagMapper } from "../tag-mapper"
import { HTMLParser } from "./html-parser"

/** returns the standard AST for the given HTML files */
export async function parseFiles(
  filenames: AbsoluteFilePath[],
  tagMapper: TagMapper
): Promise<AstNodeList[]> {
  const result = []
  const parser = new HTMLParser(tagMapper)
  for (const filename of filenames) {
    const content = await fs.readFile(filename.platformified(), {
      encoding: "utf8"
    })
    result.push(parser.parse(content, filename, 1))
  }
  return Promise.all(result)
}
