import { assert } from "chai"
import { isMailtoLink } from "./is-mailto-link"

suite("isMailtoLink", function() {
  const testData = [
    ["mailto:jean-luc.picard@starfleet.gov", true],
    ["foo", false]
  ]
  for (const [link, expected] of testData) {
    test(link as string, function() {
      assert.equal(isMailtoLink(link as string), expected)
    })
  }
})
