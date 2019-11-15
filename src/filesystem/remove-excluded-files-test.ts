import { expect } from "chai"
import { AbsoluteFilePath } from "./absolute-file-path"
import { removeExcludedFiles } from "./remove-excluded-files"

suite("removeExcludedFiles", function() {
  it("single filename given", function() {
    const fileList = [new AbsoluteFilePath("one"), new AbsoluteFilePath("two")]
    const result = removeExcludedFiles(fileList, "one")
    expect(result).to.eql([{ value: "two" }])
  })

  it("array of filenames given", function() {
    const fileList = [
      new AbsoluteFilePath("one"),
      new AbsoluteFilePath("two"),
      new AbsoluteFilePath("three")
    ]
    const result = removeExcludedFiles(fileList, ["one", "three"])
    expect(result).to.eql([{ value: "two" }])
  })

  it("regex given", function() {
    const fileList = [new AbsoluteFilePath("one"), new AbsoluteFilePath("two")]
    const result = removeExcludedFiles(fileList, "on.")
    expect(result).to.eql([{ value: "two" }])
  })

  it("array of regexes given", function() {
    const fileList = [
      new AbsoluteFilePath("one"),
      new AbsoluteFilePath("two"),
      new AbsoluteFilePath("three")
    ]
    const result = removeExcludedFiles(fileList, ["on.", "thr*"])
    expect(result).to.eql([{ value: "two" }])
  })

  it("no excludes given", function() {
    const result = removeExcludedFiles([new AbsoluteFilePath("one")], [])
    expect(result).to.eql([{ value: "one" }])
  })

  it("file in node_modules given", function() {
    const result = removeExcludedFiles(
      [
        new AbsoluteFilePath("one"),
        new AbsoluteFilePath("node_modules/zonk/broken.md")
      ],
      "one"
    )
    expect(result).to.eql([], "should automatically ignore node_modules")
  })
})
