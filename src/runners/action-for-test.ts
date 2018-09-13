import { expect } from "chai"
import { scaffoldActivity } from "../activity-list/activity"
import actionFor from "./action-for"

describe("actionFor", function() {
  context("built-in block name given", function() {
    it("returns the matching handler function", function() {
      const activity = scaffoldActivity({ type: "cd" })
      const result = actionFor(activity)
      expect(result).to.be.a("function")
    })
  })
})
