import { assert } from "chai"
import { scaffoldActivity } from "../activity-list/types/activity"
import { ActionFinder, customActionFilePaths, loadCustomActions } from "./action-finder"
import * as path from "path"
import { Actions } from "./actions"
import { ExternalActionManager } from "./external-action-manager"
import { Action } from "./types/action"

suite("actionFinder", function () {
  suite("actionFor()", function () {
    test("built-in block name", function () {
      this.timeout(10_000)
      const builtIn = new Actions()
      const func: Action = () => 1
      builtIn.register("foo", func)
      const actionFinder = new ActionFinder(builtIn, new Actions(), new ExternalActionManager())
      const activity = scaffoldActivity({ actionName: "foo" })
      assert.equal(actionFinder.actionFor(activity), func)
    })
  })

  suite("customActionFilePaths", function () {
    test("with text-run folder of the documentation codebase", function () {
      const result = customActionFilePaths(path.join(__dirname, "..", "..", "..", "documentation", "text-run"))
      assert.lengthOf(result, 2)
      assert.match(result[0], /text-run\/verify-ast-node-attributes.ts$/)
      assert.match(result[1], /text-run\/verify-handler-args.ts$/)
    })
  })

  suite("loadCustomActions", function () {
    test("with text-run folder of this codebase", function () {
      // TODO: point to JS example for faster loading
      const result = loadCustomActions(path.join(__dirname, "..", "..", "..", "documentation", "text-run"))
      assert.typeOf(result.get("verify-ast-node-attributes"), "function")
      assert.typeOf(result.get("verify-handler-args"), "function")
    })
  })
})
