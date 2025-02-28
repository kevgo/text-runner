import { suite, test } from "node:test"

import { assert } from "chai"

import { straightenLink } from "./straighten-link.js"

suite("straightenLink", function () {
  const tests = {
    "/one/../two": "/two",
    "/one//../two": "/two",
    "/foo": "/foo",
    "/one/two/../three/../four": "/one/four",
    "/one/two/three/../../four": "/one/four",
    "/one/./././two/./": "/one/two/",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(straightenLink(give), want)
    })
  }
})
