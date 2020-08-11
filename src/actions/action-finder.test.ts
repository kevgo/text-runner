import { assert } from "chai"
import { scaffoldActivity } from "../activity-list/types/activity"
import { actionFinder } from "./action-finder"

test("actionFinder.actionFor() with built-in block name", function () {
  const activity = scaffoldActivity({ actionName: "cd" })
  assert.typeOf(actionFinder.actionFor(activity), "function")
})

test("actionFinder.customActionNames()", function () {
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
    "verify-searcher-methods",
  ])
})
