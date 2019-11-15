import { assert } from "chai"
import { isLinkToAnchorInOtherFile } from "./is-link-to-anchor-in-other-file"

suite("isLinkToAnchorInOtherFile", function() {
  const tests = [
    { desc: "link to anchor in other file", give: "foo.md#bar", want: true },
    { desc: "link to anchor in same file", give: "#foo", want: false },
    { desc: "link to other file", give: "foo.md", want: false },
    { desc: "external link", give: "https://foo.com/bar", want: false },
    {
      desc: "external link with anchor",
      give: "https://foo.com/bar#baz",
      want: false
    }
  ]
  for (const tt of tests) {
    test(tt.desc as string, function() {
      assert.equal(isLinkToAnchorInOtherFile(tt.give), tt.want)
    })
  }
})
