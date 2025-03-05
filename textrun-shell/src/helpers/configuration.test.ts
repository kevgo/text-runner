import { assert } from "chai"
import { suite, test } from "node:test"

import { Configuration } from "./configuration.js"

suite("Configuration", function() {
  test("pathMapper", function() {
    const configFileContent = { globals: {} }
    const config = new Configuration(configFileContent)
    const pathMapper = config.pathMapper()
    assert.ok(pathMapper)
  })
})
