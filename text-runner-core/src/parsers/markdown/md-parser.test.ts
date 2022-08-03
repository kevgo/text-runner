import { assert } from "chai"
import * as fs from "fs-extra"
import * as path from "path"

import * as ast from "../../ast/index.js"
import { NodeScaffoldData } from "../../ast/index.js"
import * as files from "../../filesystem/index.js"
import { parse } from "./parse.js"

suite("MdParser.parseFile()", function () {
  const sharedFixtureDir = path.join("src", "parsers", "fixtures")
  const specificFixtureDir = path.join("src", "parsers", "markdown", "fixtures")
  for (const fixtureDir of [sharedFixtureDir, specificFixtureDir]) {
    for (const testDirName of fs.readdirSync(fixtureDir)) {
      const testDirPath = path.join(fixtureDir, testDirName)
      test(`parsing '${testDirName}'`, async function () {
        const expectedJSON: NodeScaffoldData[] = await fs.readJSON(path.join(testDirPath, "result.json"))
        const expected = new ast.NodeList()
        for (const expectedNodeData of expectedJSON) {
          if (expectedNodeData.file && typeof expectedNodeData.file === "string") {
            expectedNodeData.file = expectedNodeData.file.replace("*", "md")
          }
          expectedNodeData.sourceDir = testDirPath
          expected.push(ast.Node.scaffold(expectedNodeData))
        }
        const actual = await parse([new files.FullFilePath("input.md")], new files.SourceDir(testDirPath))
        assert.deepEqual(actual[0], expected)
      })
    }
  }
})
