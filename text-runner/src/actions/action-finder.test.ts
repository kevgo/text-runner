import { assert } from "chai"
import { scaffoldActivity } from "../activity-list/types/activity"
import {
  ActionFinder,
  customActionFilePaths,
  loadCustomActions,
  builtinActionFilePaths,
  loadBuiltinActions,
} from "./action-finder"
import * as path from "path"
import { Actions } from "./actions"
import { ExternalActionManager } from "./external-action-manager"
import { Action } from "./types/action"

suite("actionFinder", function () {
  suite("actionFor()", function () {
    test("built-in region name", function () {
      const builtIn = new Actions()
      const func: Action = () => 1
      builtIn.register("foo", func)
      const actionFinder = new ActionFinder(builtIn, new Actions(), new ExternalActionManager())
      const activity = scaffoldActivity({ actionName: "foo" })
      assert.equal(actionFinder.actionFor(activity), func)
    })
    test("custom region name", function () {
      const custom = new Actions()
      const func: Action = () => 1
      custom.register("foo", func)
      const actionFinder = new ActionFinder(new Actions(), custom, new ExternalActionManager())
      const activity = scaffoldActivity({ actionName: "foo" })
      assert.equal(actionFinder.actionFor(activity), func)
    })
  })

  test("builtinActionFilePaths", function () {
    const result = builtinActionFilePaths().map((fp) => path.basename(fp))
    assert.deepEqual(result, ["check-image", "check-link", "test"])
  })

  suite("customActionFilePaths", function () {
    test("with text-run folder of the documentation codebase", function () {
      const result = customActionFilePaths(path.join(__dirname, "..", "..", "..", "documentation", "text-run"))
      assert.lengthOf(result, 2)
      assert.match(result[0], /text-run\/verify-ast-node-attributes.ts$/)
      assert.match(result[1], /text-run\/verify-action-args.ts$/)
    })
  })

  test("loadBuiltinActions", function () {
    const result = loadBuiltinActions()
    assert.deepEqual(result.names(), ["check-image", "check-link", "test"])
  })

  suite("loadCustomActions", function () {
    test("with text-run folder of this codebase", function () {
      const result = loadCustomActions(
        path.join(__dirname, "..", "..", "..", "examples", "custom-action-sync", "text-run")
      )
      assert.typeOf(result.get("hello-world"), "function")
    })
  })
})
