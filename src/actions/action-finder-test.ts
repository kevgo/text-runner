import { assert } from "chai"
import { scaffoldActivity } from "../activity-list/types/activity"
import { actionFinder } from "./action-finder"

describe("actionFinder", function() {
  describe("actionFor", function() {
    context("built-in block name given", function() {
      it("returns the matching handler function", function() {
        const activity = scaffoldActivity({ actionName: "cd" })
        const result = actionFinder.actionFor(activity)
        assert.typeOf(result, "function")
      })
    })
  })
  describe("customActionNames", function() {
    it("returns the names of all built-in actions", function() {
      const result = actionFinder.customActionNames()
      assert.deepEqual(result, [
        "cd-into-empty-tmp-folder",
        "cd-workspace",
        "create-markdown-file",
        "run-markdown-in-textrun",
        "run-textrun",
        "verify-ast-node-attributes",
        "verify-handler-args",
        "verify-make-command",
        "verify-searcher-methods"
      ])
    })
  })
})
