import { assert } from "chai"

import { addLeadingDotUnlessEmpty } from "./add-leading-dot-unless-empty"

test("addLeadingDotUnlessEmpty", function () {
  assert.equal(addLeadingDotUnlessEmpty("foo"), ".foo")
  assert.equal(addLeadingDotUnlessEmpty(".foo"), ".foo")
  assert.equal(addLeadingDotUnlessEmpty(""), "")
})
