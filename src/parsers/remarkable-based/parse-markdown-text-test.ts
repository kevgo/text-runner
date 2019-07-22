import { expect } from "chai"
import fs from "fs-extra"
import path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { parseMarkdownText } from "./parse-markdown-text"

describe("parseMarkdownText", async function() {
  const testCases = await fs.readdir(path.join(__dirname, "tests"))
  for (const testCase of testCases) {
    const testCaseDir = path.join(__dirname, "tests", testCase)
    const files = await fs.readdir(testCaseDir)
    const mdFiles = files.filter(file => file.endsWith(".md"))
    for (const inputFile of mdFiles) {
      let name = testCase
      if (inputFile !== "input.md") {
        name += `-${path.basename(inputFile, ".md")}`
      }
      it(name, async function() {
        const input = await fs.readFile(path.join(testCaseDir, inputFile))
        const expected = require(path.join(testCaseDir, "result.json"))
        const actual = await parseMarkdownText(
          input.toString().trim(),
          new AbsoluteFilePath("input.md")
        )
        expect(actual).to.eql(expected)
      })
    }
  }
})
