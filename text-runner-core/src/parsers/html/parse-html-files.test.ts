import { assert } from "chai"
import * as fs from "fs-extra"
import * as path from "path"

import * as ast from "../../ast"
import { FullPath } from "../../filesystem/full-path"
import { TagMapper } from "../tag-mapper"
import { parseHTMLFiles } from "./parse-html-files"

suite("parseHTMLFiles", function () {
  const tagMapper = new TagMapper()
  const sharedFixtureDir = path.join("src", "parsers", "fixtures")
  const specificFixtureDir = path.join("src", "parsers", "html", "fixtures")
  for (const fixturePath of [sharedFixtureDir, specificFixtureDir]) {
    for (const testDirName of fs.readdirSync(fixturePath)) {
      const testDirPath = path.join(fixturePath, testDirName)
      test(`parse '${testDirName}'`, async function () {
        const expectedPath = path.join(testDirPath, "result.json")
        const expectedJSON = await fs.readJSON(expectedPath)
        const expected = new ast.NodeList()
        for (const e of expectedJSON) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          e.file = e.file.replace("*", "html")
          expected.push(ast.Node.scaffold(e))
        }
        const actual = await parseHTMLFiles([new FullPath("input.html")], testDirPath, tagMapper)
        assert.deepEqual(actual[0], expected)
      })
    }
  }
})
