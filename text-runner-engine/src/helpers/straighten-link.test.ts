import { assert } from "chai"
import { suite, test } from "node:test"

import { straightenLink } from "./straighten-link.js"

suite("straightenLink", function() {
  const tests = {
    "/foo": "/foo",
    "/one/../two": "/two",
    "/one/./././two/./": "/one/two/",
    "/one//../two": "/two",
    "/one/two/../three/../four": "/one/four",
    "/one/two/three/../../four": "/one/four"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function() {
      assert.equal(straightenLink(give), want)
    })
  }
})
