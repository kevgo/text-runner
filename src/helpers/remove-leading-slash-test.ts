import { expect } from "chai"
import { describe, it } from "mocha"
import removeLeadingSlash from "./remove-leading-slash.js"

describe("removeLeadingSlash", function() {
  it("removes the leading slash if one exists", function() {
    expect(removeLeadingSlash("/foo/bar/")).to.equal("foo/bar/")
  })

  it("removes the leading backslash if one exists", function() {
    expect(removeLeadingSlash("\\foo\\bar\\")).to.equal("foo\\bar\\")
  })

  it("leaves a string without leading slash unchanged", function() {
    expect(removeLeadingSlash("foo/bar/")).to.equal("foo/bar/")
  })
})
