import { assert } from "chai"
import { Publications } from "../configuration/publications/publications"
import { AbsoluteFilePath } from "./absolute-file-path"
import { UnknownLink } from "./unknown-link"
import { AbsoluteLink } from "./absolute-link"

suite("UnknownLink.absolutify()", function() {
  const tests = [
    {
      desc: "relative link",
      link: "foo/bar.md",
      containingFilePath: "/dir/file.md",
      expected: "/dir/foo/bar.md"
    },
    {
      desc: "absolute link",
      link: "/foo/bar.md",
      containingFilePath: "/dir/file.md",
      expected: "/foo/bar.md"
    }
  ]
  for (const tt of tests) {
    test(tt.desc, function() {
      const link = new UnknownLink(tt.link)
      const containingFile = new AbsoluteFilePath(tt.containingFilePath)
      const publications = new Publications()

      const actual = link.absolutify(containingFile, publications)

      assert.deepEqual(actual, new AbsoluteLink(tt.expected))
    })
  }
})

suite("UnknownLink.isAbsoluteLink()", function() {
  const tests = {
    "/foo/bar": true,
    "foo/bar": false,
    "../foo/bar": false
  }
  for (const [input, expected] of Object.entries(tests)) {
    test(input, function() {
      const link = new UnknownLink(input)
      assert.equal(link.isAbsolute(), expected)
    })
  }
})
