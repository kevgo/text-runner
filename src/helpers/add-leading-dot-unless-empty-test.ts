import { expect } from "chai"
import { addLeadingDotUnlessEmpty } from "./add-leading-dot-unless-empty"

describe("addLeadingDotUnlessEmpty", function() {
  it("adds a leading dot if there isnt one", function() {
    expect(addLeadingDotUnlessEmpty("foo")).to.equal(".foo")
  })
  it("does not add another leading dot if there is one", function() {
    expect(addLeadingDotUnlessEmpty(".foo")).to.equal(".foo")
  })
  it("does not add a leading dot if the string is empty", function() {
    expect(addLeadingDotUnlessEmpty("")).to.equal("")
  })
})
