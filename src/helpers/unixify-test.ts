import unifixy from "./unifixy.js"
import { describe, it } from "mocha"
import { expect } from "chai"

describe("unifixy", function() {
  it("converts Windows paths to Unix paths", function() {
    expect(unifixy("\\foo\\bar\\")).to.equal("/foo/bar/")
  })
  it("leaves Unix paths alone", function() {
    expect(unifixy("/foo/bar/")).to.equal("/foo/bar/")
  })
  it("handles mixed path styles", function() {
    expect(unifixy("/foo\\bar/")).to.equal("/foo/bar/")
  })
})
