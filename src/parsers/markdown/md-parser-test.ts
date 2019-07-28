import { strict as assert } from "assert"
import fs from "fs-extra"
import path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNode } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { MdParser } from "./md-parser"

describe("MdParser", function() {
  describe("parseFile", function() {
    const fixtureDirPath = path.join("src", "parsers", "fixtures")
    const testDirNames = fs.readdirSync(fixtureDirPath)
    const mdParser = new MdParser()
    for (const testDirName of testDirNames) {
      const testDirPath = path.join(fixtureDirPath, testDirName)
      it(`parsing '${testDirName}'`, async function() {
        const expectedJSON = await fs.readJSON(
          path.join(testDirPath, "inline.json")
        )
        const expected = new AstNodeList()
        for (const e of expectedJSON) {
          expected.push(AstNode.scaffold(e))
        }
        const actual = await mdParser.parseFile(
          new AbsoluteFilePath(path.join(testDirPath, "input.html"))
        )
        assert.deepEqual(actual, expected)
      })
    }
  })
})
