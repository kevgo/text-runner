import * as assertNoDiff from "assert-no-diff"
import * as fs from "fs/promises"
import { suite, test } from "node:test"
import * as path from "path"

import * as ast from "../../ast/index.js"
import { NodeScaffoldData } from "../../ast/index.js"
import * as files from "../../filesystem/index.js"
import { parse } from "./parse.js"

suite("MdParser.parseFile()", async () => {
  const sharedFixtureDir = path.join("src", "parsers", "fixtures")
  const specificFixtureDir = path.join("src", "parsers", "markdown", "fixtures")
  for (const fixtureDir of [sharedFixtureDir, specificFixtureDir]) {
    for (const testDirName of await fs.readdir(fixtureDir)) {
      const testDirPath = path.join(fixtureDir, testDirName)
      test(`parsing '${testDirName}'`, async () => {
        const filePath = path.join(testDirPath, "result.json")
        const fileContent = await fs.readFile(filePath, "utf-8")
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
        assertNoDiff.json(actual[0], expected)
      })
    }
  }
})
