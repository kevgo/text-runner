import { assert } from "chai"
import { determineConfiguration } from "./determine-configuration"
import * as tr from "text-runner-core"

suite("loadConfiguration()", function () {
  test("no user config given", function () {
    const config = determineConfiguration({}, {})
    assert.deepEqual(config, { publications: new tr.Publications() })
  })

  test("user config given", async function () {
    const config = determineConfiguration({ files: "*.md" }, {})
    assert.equal(config.files, "*.md")
  })
})
