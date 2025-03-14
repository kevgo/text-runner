import { expect } from "chai"
import { suite, test } from "node:test"

import * as files from "./index.js"

suite("removeExcludedFiles", () => {
  test("single filename given", () => {
    const fileList = [new files.FullFilePath("one"), new files.FullFilePath("two")]
    const removedList = files.removeExcludedFiles(fileList, "one")
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("array of filenames given", () => {
    const fileList = [new files.FullFilePath("one"), new files.FullFilePath("two"), new files.FullFilePath("three")]
    const removedList = files.removeExcludedFiles(fileList, ["one", "three"])
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("regex given", () => {
    const fileList = [new files.FullFilePath("one"), new files.FullFilePath("two")]
    const removedList = files.removeExcludedFiles(fileList, "on.")
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("array of regexes given", () => {
    const fileList = [new files.FullFilePath("one"), new files.FullFilePath("two"), new files.FullFilePath("three")]
    const removedList = files.removeExcludedFiles(fileList, ["on.", "thr*"])
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("no excludes given", () => {
    const removedList = files.removeExcludedFiles([new files.FullFilePath("one")], [])
    expect(removedList).to.eql([{ value: "one" }])
  })

  test("relative folder name given", () => {
    const removedList = files.removeExcludedFiles(
      [new files.FullFilePath("one"), new files.FullFilePath("node_modules/zonk/broken.md")],
      "node_modules"
    )
    expect(removedList).to.eql([{ value: "one" }])
  })
})
