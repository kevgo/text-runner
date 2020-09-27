import { expect } from "chai"

import { AbsoluteFilePath } from "./absolute-file-path"
import { removeExcludedFiles } from "./get-filenames"

suite("removeExcludedFiles", function () {
  test("single filename given", function () {
    const fileList = [new AbsoluteFilePath("one"), new AbsoluteFilePath("two")]
    const removedList = removeExcludedFiles(fileList, "one")
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("array of filenames given", function () {
    const fileList = [new AbsoluteFilePath("one"), new AbsoluteFilePath("two"), new AbsoluteFilePath("three")]
    const removedList = removeExcludedFiles(fileList, ["one", "three"])
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("regex given", function () {
    const fileList = [new AbsoluteFilePath("one"), new AbsoluteFilePath("two")]
    const removedList = removeExcludedFiles(fileList, "on.")
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("array of regexes given", function () {
    const fileList = [new AbsoluteFilePath("one"), new AbsoluteFilePath("two"), new AbsoluteFilePath("three")]
    const removedList = removeExcludedFiles(fileList, ["on.", "thr*"])
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("no excludes given", function () {
    const removedList = removeExcludedFiles([new AbsoluteFilePath("one")], [])
    expect(removedList).to.eql([{ value: "one" }])
  })

  test("file in node_modules given", function () {
    const removedList = removeExcludedFiles(
      [new AbsoluteFilePath("one"), new AbsoluteFilePath("node_modules/zonk/broken.md")],
      "one"
    )
    expect(removedList).to.eql([], "should automatically ignore node_modules")
  })
})
