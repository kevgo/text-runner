import { assert } from "chai"
import { isLinkToAnchorInSameFile } from "./is-link-to-anchor-in-same-file"

suite("isLinkToAnchorInSameFile", function() {
  const tests = [
    { desc: "link to anchor in same file", give: "#foo", want: true },
    { desc: "link to anchor in other file", give: "foo#bar", want: false },
    { desc: "link to other file", give: "foo.md", want: false }
  ]
  for (const tt of tests) {
    test(tt.desc, function() {
      assert.equal(isLinkToAnchorInSameFile(tt.give), tt.want)
    })
  }
})
