import { assert } from "chai"
import fs from "fs"
import * as path from "path"

import * as ast from "../../ast/index.js"
import { NodeScaffoldData } from "../../ast/index.js"
import * as files from "../../filesystem/index.js"
import { TagMapper } from "../tag-mapper.js"
import { parseHTMLFiles } from "./parse-html-files.js"

suite("parseHTMLFiles", function () {
  const tagMapper = new TagMapper()
  const sharedFixtureDir = path.join("src", "parsers", "fixtures")
  const specificFixtureDir = path.join("src", "parsers", "html", "fixtures")
  for (const fixturePath of [sharedFixtureDir, specificFixtureDir]) {
    for (const testDirName of fs.readdirSync(fixturePath)) {
      const testDirPath = path.join(fixturePath, testDirName)
      test(`parse '${testDirName}'`, async function () {
        const resultFilePath = path.join(testDirPath, "result.json")
        const resultData: NodeScaffoldData[] = JSON.parse(fs.readFileSync(resultFilePath, "utf-8"))
        const expected = new ast.NodeList()
        for (const resultEntry of resultData) {
          if (resultEntry.file && typeof resultEntry.file === "string") {
            resultEntry.file = resultEntry.file.replace("*", "html")
          }
          resultEntry.sourceDir = testDirPath
          expected.push(ast.Node.scaffold(resultEntry))
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
