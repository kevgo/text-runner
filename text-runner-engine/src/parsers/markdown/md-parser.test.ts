import { assert } from "chai"
import * as fs from "fs"
import { suite, test } from "node:test"
import * as path from "path"

import * as ast from "../../ast/index.js"
import { NodeScaffoldData } from "../../ast/index.js"
import * as files from "../../filesystem/index.js"
import { parse } from "./parse.js"

suite("MdParser.parseFile()", () => {
  const sharedFixtureDir = path.join("src", "parsers", "fixtures")
  const specificFixtureDir = path.join("src", "parsers", "markdown", "fixtures")
  for (const fixtureDir of [sharedFixtureDir, specificFixtureDir]) {
    for (const testDirName of fs.readdirSync(fixtureDir)) {
      const testDirPath = path.join(fixtureDir, testDirName)
      test(`parsing '${testDirName}'`, async () => {
        const filePath = path.join(testDirPath, "result.json")
        const fileContent = fs.readFileSync(filePath, "utf-8")
        const expectedJSON: NodeScaffoldData[] = JSON.parse(fileContent)
        const expected = new ast.NodeList()
        for (const expectedNodeData of expectedJSON) {
          if (expectedNodeData.file && typeof expectedNodeData.file === "string") {
            expectedNodeData.file = expectedNodeData.file.replace("*", "md")
          }
          expectedNodeData.sourceDir = testDirPath
          expected.push(ast.Node.scaffold(expectedNodeData))
        }
        const actual = await parse([new files.FullFilePath("input.md")], new files.SourceDir(testDirPath))
        try {
          assert.deepEqual(actual[0], expected)
        } catch (e) {
          console.log("ACTUAL:\n", JSON.stringify(actual[0], null, "  "))
          throw e
        }
      })
    }
  }
})
