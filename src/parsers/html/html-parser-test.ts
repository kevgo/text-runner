import { strict as assert } from "assert"
import fs from "fs-extra"
import path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNode } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { HTMLParser } from "./html-parser"

describe("HtmlParser", function() {
  describe("parseFile", function() {
    const fixtureDirPath = path.join("src", "parsers", "fixtures")
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

  describe(".parseInline()", function() {
    it("considers the file offset", function() {
      const htmlParser = new HTMLParser()
      const file = new AbsoluteFilePath("foo.html")
      const content = "hello"
      const parsed = htmlParser.parseInline(content, file, 5, true)
      assert.deepEqual(parsed[0].line, 5)
    })
  })
})
