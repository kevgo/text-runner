import { assert } from "chai"
import * as fs from "fs-extra"
import * as path from "path"

import * as ast from "../../ast"
import * as files from "../../filesystem/index"
import { parse } from "./parse"

suite("MdParser.parseFile()", function () {
  const sharedFixtureDir = path.join("src", "parsers", "fixtures")
  const specificFixtureDir = path.join("src", "parsers", "markdown", "fixtures")
  for (const fixtureDir of [sharedFixtureDir, specificFixtureDir]) {
    for (const testDirName of fs.readdirSync(fixtureDir)) {
      const testDirPath = path.join(fixtureDir, testDirName)
      test(`parsing '${testDirName}'`, async function () {
        const expectedJSON = await fs.readJSON(path.join(testDirPath, "result.json"))
        const expected = new ast.NodeList()
        for (const expectedNodeData of expectedJSON) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          expectedNodeData.file = expectedNodeData.file.replace("*", "md")
          expected.push(ast.Node.scaffold(expectedNodeData))
        }
        const actual = await parse([new files.FullFile("input.md")], new files.AbsoluteDir(testDirPath))
        assert.deepEqual(actual[0], expected)
      })
    }
  }
})
