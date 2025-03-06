import { assert } from "chai"
import { suite, test } from "node:test"

import { PathMapper } from "./path-mapper.js"

suite("PathMapper", function() {
  const mappings = {
    bar: "/three/four/bar",
    foo: "/one/two/foo"
  }
  const pathMapper = new PathMapper(mappings)
  const tests = {
    "bar README.md": "/three/four/bar README.md",
    "baz --online": "baz --online",
    "foo -b": "/one/two/foo -b"
  }
  // the method will be used as a higher-order function in the production code
  const globalizePath = pathMapper.globalizePathFunc()
  for (const [give, want] of Object.entries(tests)) {
    test(`makePath "${give}" --> "${want}"`, function() {
      const have = globalizePath(give)
      assert.equal(have, want)
    })
  }
})
