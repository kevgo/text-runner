import { assert } from "chai"
import { unixify } from "./unixify"

suite("unifixy", function() {
  const tests = [
    { in: "\\foo\\bar\\", out: "/foo/bar/" },
    { in: "/foo/bar/", out: "/foo/bar/" },
    { in: "/foo\\bar/", out: "/foo/bar/" }
  ]
  for (const tt of tests) {
    assert.equal(unixify(tt.in), tt.out)
  }
})
