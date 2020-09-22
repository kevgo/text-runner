import { pathRelativeToDir } from "./path-relative-to-dir"
import { strict as assert } from "assert"

suite("pathRelativeToDir", function () {
  test("in same dir", function () {
    const have = pathRelativeToDir("/foo/bar/1.md", "/foo/bar")
    const want = "1.md"
    assert.equal(have, want)
  })
  test("in subdir", function () {
    const have = pathRelativeToDir("/foo/bar/baz/1.md", "/foo/bar")
    const want = process.platform === "win32" ? "baz\\1.md" : "baz/1.md"
    assert.equal(have, want)
  })
})
