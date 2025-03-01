import { assert } from "chai"
import { suite, test } from "node:test"
import * as path from "path"
import * as url from "url"

import * as activities from "../activities/index.js"
import { Actions } from "./actions.js"
import { ExternalActionManager } from "./external-action-manager.js"
import {
  builtinActionFilePaths,
  customActionFilePaths,
  Finder,
  loadBuiltinActions,
  loadCustomActions
} from "./finder.js"
import { Action } from "./index.js"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

suite("actionFinder", function () {
  suite("actionFor()", function () {
    test("built-in region name", async function () {
      const builtIn = new Actions()
      const func: Action = () => 254
      builtIn.register("foo", func)
      const actionFinder = new Finder(builtIn, new Actions(), new ExternalActionManager())
      const activity = activities.scaffold({ actionName: "foo" })
      assert.equal(await actionFinder.actionFor(activity), func)
    })
    test("custom region name", async function () {
      const custom = new Actions()
      const func: Action = () => 254
      custom.register("foo", func)
      const actionFinder = new Finder(new Actions(), custom, new ExternalActionManager())
      const activity = activities.scaffold({ actionName: "foo" })
      assert.equal(await actionFinder.actionFor(activity), func)
    })
  })

  test("builtinActionFilePaths", async function () {
    const result = (await builtinActionFilePaths()).map(fp => path.basename(fp))
    assert.deepEqual(result, ["check-image.ts", "check-link.ts", "test.ts"])
  })

  suite("customActionFilePaths", function () {
    test("with text-runner folder of the documentation codebase", async function () {
      const result = await customActionFilePaths(path.join(__dirname, "..", "..", "..", "documentation", "text-runner"))
      assert.lengthOf(result, 5)
      assert.match(result[0], /text-runner\/action-arg.ts$/)
      assert.match(result[1], /text-runner\/all-action-args.ts$/)
    })
  })

  test("loadBuiltinActions", async function () {
    const result = await loadBuiltinActions()
    assert.deepEqual(result.names(), ["check-image", "check-link", "test"])
  })

  suite("loadCustomActions", function () {
    test("with text-runner folder of this codebase", async function () {
      const result = await loadCustomActions(
        path.join(__dirname, "..", "..", "..", "examples", "custom-action-esm", "text-runner")
      )
      assert.typeOf(result.get("hello-world-sync"), "function")
    })
  })
})
