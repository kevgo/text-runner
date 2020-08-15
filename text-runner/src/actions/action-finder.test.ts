import { assert } from "chai"
import { scaffoldActivity } from "../activity-list/types/activity"
import { ActionFinder, customActionFilePaths, loadCustomActions } from "./action-finder"
import * as path from "path"

suite("actionFinder", function () {
  suite("actionFor()", function () {
    test("built-in block name", function () {
      this.timeout(10_000)
      const activity = scaffoldActivity({ actionName: "test" })
      const actionFinder = new ActionFinder(path.join(__dirname, "..", "..", "text-run"))
      assert.typeOf(actionFinder.actionFor(activity), "function")
    })
  })

  suite("customActionFilePaths", function () {
    test("with text-run folder of this codebase", function () {
      const result = customActionFilePaths(path.join(__dirname, "..", "..", "text-run"))
      assert.lengthOf(result, 2)
      assert.match(result[0], /text-run\/verify-ast-node-attributes.ts$/)
      assert.match(result[1], /text-run\/verify-handler-args.ts$/)
    })
  })

  suite("loadCustomActions", function () {
    test("with text-run folder of this codebase", function () {
      const result = loadCustomActions(path.join(__dirname, "..", "..", "text-run"))
      assert.typeOf(result["verify-ast-node-attributes"], "function")
      assert.typeOf(result["verify-handler-args"], "function")
    })
  })
})
