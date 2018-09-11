import { expect } from "chai"
import { describe, it } from "mocha"
import unifixy from "./unifixy"

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
