import { assert } from "chai"
import { isExternalLink } from "./is-external-link"

suite("isExternalLink", function() {
  const tests = [
    { desc: "link without protocol", give: "//foo.com", want: true },
    { desc: "link with protocol", give: "http://foo.com", want: true },
    { desc: "absolute link", give: "/one/two.md", want: false },
    { desc: "relative link", give: "one.md", want: false },
    { desc: "relative link up", give: "../one.md", want: false }
  ]
  for (const tt of tests) {
    test(tt.desc, function() {
      assert.equal(isExternalLink(tt.give), tt.want)
    })
  }
})
