import { assert } from "chai"
import { addLeadingDotUnlessEmpty } from "./add-leading-dot-unless-empty"

describe("addLeadingDotUnlessEmpty", function() {
  it("adds a leading dot if there isnt one", function() {
    assert.equal(addLeadingDotUnlessEmpty("foo"), ".foo")
  })
  it("does not add another leading dot if there is one", function() {
    assert.equal(addLeadingDotUnlessEmpty(".foo"), ".foo")
  })
  it("does not add a leading dot if the string is empty", function() {
    assert.equal(addLeadingDotUnlessEmpty(""), "")
  })
})
