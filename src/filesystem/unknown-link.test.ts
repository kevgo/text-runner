import { assert } from "chai"
import { Publications } from "../configuration/publications/publications"
import { AbsoluteFilePath } from "./absolute-file-path"
import { UnknownLink } from "./unknown-link"
import { AbsoluteLink } from "./absolute-link"

suite("UnknownLink.absolutify()", function () {
  const tests = [
    {
      desc: "relative link",
      link: "foo/bar.md",
      give: "/dir/file.md",
      want: "/dir/foo/bar.md",
    },
    {
      desc: "absolute link",
      link: "/foo/bar.md",
      give: "/dir/file.md",
      want: "/foo/bar.md",
    },
  ]
  for (const tt of tests) {
    test(tt.desc, function () {
      const unknownLink = new UnknownLink(tt.link)
      const containingFile = new AbsoluteFilePath(tt.give)
      const publications = new Publications()
      const absoluteLink = unknownLink.absolutify(containingFile, publications)
      assert.deepEqual(absoluteLink, new AbsoluteLink(tt.want))
    })
  }
})

test("UnknownLink.isAbsolute()", function () {
  assert.isTrue(new UnknownLink("/foo/bar").isAbsolute())
  assert.isFalse(new UnknownLink("foo/bar").isAbsolute())
  assert.isFalse(new UnknownLink("../foo/bar").isAbsolute())
})
