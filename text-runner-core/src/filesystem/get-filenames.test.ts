import { expect } from "chai"

import { FullPath } from "./full-path"
import { removeExcludedFiles } from "./get-filenames"

suite("removeExcludedFiles", function () {
  test("single filename given", function () {
    const fileList = [new FullPath("one"), new FullPath("two")]
    const removedList = removeExcludedFiles(fileList, "one")
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("array of filenames given", function () {
    const fileList = [new FullPath("one"), new FullPath("two"), new FullPath("three")]
    const removedList = removeExcludedFiles(fileList, ["one", "three"])
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("regex given", function () {
    const fileList = [new FullPath("one"), new FullPath("two")]
    const removedList = removeExcludedFiles(fileList, "on.")
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("array of regexes given", function () {
    const fileList = [new FullPath("one"), new FullPath("two"), new FullPath("three")]
    const removedList = removeExcludedFiles(fileList, ["on.", "thr*"])
    expect(removedList).to.eql([{ value: "two" }])
  })

  test("no excludes given", function () {
    const removedList = removeExcludedFiles([new FullPath("one")], [])
    expect(removedList).to.eql([{ value: "one" }])
  })

  test("relative folder name given", function () {
    const removedList = removeExcludedFiles(
      [new FullPath("one"), new FullPath("node_modules/zonk/broken.md")],
      "node_modules"
    )
    expect(removedList).to.eql([{ value: "one" }])
  })
})
