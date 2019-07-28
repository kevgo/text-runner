import { strict as assert } from "assert"
import fs from "fs-extra"
import path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { HTMLParser } from "./html-parser"

describe("HtmlParser", function() {
  const fixtureDirPath = path.join("src", "parsers", "html", "fixtures")
  const testDirNames = fs.readdirSync(fixtureDirPath)
  const htmlParser = new HTMLParser()
  for (const testDirName of testDirNames) {
    const testDirPath = path.join(fixtureDirPath, testDirName)
    it(`inline '${testDirName}' tag parsing`, async function() {
      const expected = await fs.readJSON(path.join(testDirPath, "inline.json"))
      const actual = await htmlParser.parseFile(
        new AbsoluteFilePath(path.join(testDirPath, "input.html"))
      )
      assert.equal(actual, expected)
    })
  }
})
