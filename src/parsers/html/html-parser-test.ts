import { strict as assert } from "assert"
import fs from "fs-extra"
import path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNode } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { TagMapper } from "../tag-mapper"
import { HTMLParser } from "./html-parser"

describe("HtmlParser", function() {
  describe("parseFile", function() {
    const tagMapper = new TagMapper()
    const htmlParser = new HTMLParser(tagMapper)
    const sharedFixtureDir = path.join("src", "parsers", "fixtures")
    const specificFixtureDir = path.join("src", "parsers", "html", "fixtures")
    for (const fixturePath of [sharedFixtureDir, specificFixtureDir]) {
      for (const testDirName of fs.readdirSync(fixturePath)) {
        const testDirPath = path.join(fixturePath, testDirName)
        it(`parse '${testDirName}'`, async function() {
          const expectedPath = path.join(testDirPath, "result.json")
          const expectedJSON = await fs.readJSON(expectedPath)
          const expected = new AstNodeList()
          for (const e of expectedJSON) {
            e.file = e.file.replace("*", "html")
            expected.push(AstNode.scaffold(e))
          }
          const actual = await htmlParser.parseFile(
            new AbsoluteFilePath(path.join(testDirPath, "input.html"))
          )
          assert.deepEqual(actual, expected)
        })
      }
    }
  })

  describe(".parseInline()", function() {
    it("considers the file offset", function() {
      const tagMapper = new TagMapper()
      const htmlParser = new HTMLParser(tagMapper)
      const file = new AbsoluteFilePath("foo.html")
      const content = "hello"
      const parsed = htmlParser.parseInline(content, file, 5)
      assert.deepEqual(parsed[0].line, 5)
    })
  })
})
