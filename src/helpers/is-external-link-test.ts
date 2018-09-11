import { expect } from "chai"
import { describe, it } from "mocha"
import isExternalLink from "./is-external-link.js"

describe("isExternalLink", function() {
  const testData = [
    ["link without protocol", "//foo.com", true],
    ["link with protocol", "http://foo.com", true],
    ["absolute link", "/one/two.md", false],
    ["relative link", "one.md", false],
    ["relative link up", "../one.md", false]
  ]
  for (const [description, link, expected] of testData) {
    it(description, function() {
      expect(isExternalLink(link as string)).to.equal(expected)
    })
  }
})
