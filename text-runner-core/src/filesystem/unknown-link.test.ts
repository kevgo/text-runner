import { suite, test } from "node:test"

import { assert } from "chai"

import * as configuration from "../configuration/index.js"
import * as files from "./index.js"

suite("UnknownLink", function () {
  suite(".absolutify()", function () {
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
        const unknownLink = new files.UnknownLink(tt.link)
        const containingFile = new files.FullFilePath(tt.give)
        const publications = new configuration.Publications()
        const location = new files.Location(new files.SourceDir(""), containingFile, 1)
        const absoluteLink = unknownLink.absolutify(location, publications)
        assert.deepEqual(absoluteLink, new files.FullLink(tt.want))
      })
    }
  })

  test(".isAbsolute()", function () {
    assert.isTrue(new files.UnknownLink("/foo/bar").isAbsolute())
    assert.isFalse(new files.UnknownLink("foo/bar").isAbsolute())
    assert.isFalse(new files.UnknownLink("../foo/bar").isAbsolute())
  })
})
