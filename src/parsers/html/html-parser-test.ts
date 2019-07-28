import { strict as assert } from "assert"
import fs from "fs-extra"
import path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNode } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { HTMLParser } from "./html-parser"

describe("HtmlParser", function() {
  const fixtureDirPath = path.join("src", "parsers", "html", "fixtures")
  const testDirNames = fs.readdirSync(fixtureDirPath)
  const htmlParser = new HTMLParser()
  for (const testDirName of testDirNames) {
    const testDirPath = path.join(fixtureDirPath, testDirName)
    it(`inline '${testDirName}' tag parsing`, async function() {
      const expectedJSON = await fs.readJSON(
        path.join(testDirPath, "inline.json")
      )
      const expected = new AstNodeList()
      for (const e of expectedJSON) {
        expected.push(AstNode.scaffold(e))
      }
      const actual = await htmlParser.parseFile(
        new AbsoluteFilePath(path.join(testDirPath, "input.html"))
      )
      assert.deepEqual(actual, expected)
    })
  }
})
