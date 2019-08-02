import { strict as assert } from "assert"
import fs from "fs-extra"
import path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNode } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { TagMapper } from "../tag-mapper"
import { parseHTMLFiles } from "./parse-html-files"

describe("parseFiles", function() {
  const tagMapper = new TagMapper()
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
        const actual = await parseHTMLFiles(
          [new AbsoluteFilePath(path.join(testDirPath, "input.html"))],
          tagMapper
        )
        assert.deepEqual(actual[0], expected)
      })
    }
  }
})
