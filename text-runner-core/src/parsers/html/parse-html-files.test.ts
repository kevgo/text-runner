import { assert } from "chai"
import * as fs from "fs-extra"
import * as path from "path"

import * as ast from "../../ast"
import * as files from "../../filesystem/index"
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
          e.sourceDir = testDirPath
          expected.push(ast.Node.scaffold(e))
        }
        const actual = await parseHTMLFiles(
          [new files.FullFilePath("input.html")],
          new files.SourceDir(testDirPath),
          tagMapper
        )
        assert.deepEqual(actual[0], expected)
      })
    }
  }
})
