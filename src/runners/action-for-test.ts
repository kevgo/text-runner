import { expect } from "chai"
import { context, describe, it } from "mocha"
import scaffoldActivity from "../../test/scaffolders/activity.js"
import actionFor from "./action-for.js"

describe("actionFor", function() {
  context("built-in block name given", function() {
    it("returns the matching handler function", function() {
      const activity = scaffoldActivity({ type: "cd" })
      const result = actionFor(activity)
      expect(result).to.be.a("function")
    })
  })
})
