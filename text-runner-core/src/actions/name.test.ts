import { assert } from "chai"

import { name } from "./name"

suite("getActionName()", function () {
  const tests = {
    "/users/foo/text-runner/text-run/cdBack.js": "cd-back",
  }
  for (const [give, want] of Object.entries(tests)) {
    assert.equal(name(give), want)
  }
})
