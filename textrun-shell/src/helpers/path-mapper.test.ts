import { assert } from "chai"

import { PathMapper } from "./path-mapper.js"

suite("PathMapper", function () {
  const mappings = {
    foo: "/one/two/foo",
    bar: "/three/four/bar",
  }
  const pathMapper = new PathMapper(mappings)
  const tests = {
    "foo -b": "/one/two/foo -b",
    "bar README.md": "/three/four/bar README.md",
    "baz --online": "baz --online",
  }
  // the method will be used as a higher-order function in the production code
  const globalizePath = pathMapper.globalizePathFunc()
  for (const [give, want] of Object.entries(tests)) {
    test(`makePath "${give}" --> "${want}"`, function () {
      const have = globalizePath(give)
      assert.equal(have, want)
    })
  }
})
