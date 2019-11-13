import { assert } from "chai"
import { isLinkToAnchorInSameFile } from "./is-link-to-anchor-in-same-file"

describe("isLinkToAnchorInSameFile", function() {
  const testData = [
    ["link to anchor in same file", "#foo", true],
    ["link to anchor in other file", "foo#bar", false],
    ["link to other file", "foo.md", false]
  ]
  for (const [description, link, expected] of testData) {
    it(description as string, function() {
      assert.equal(isLinkToAnchorInSameFile(link as string), expected)
    })
  }
})
