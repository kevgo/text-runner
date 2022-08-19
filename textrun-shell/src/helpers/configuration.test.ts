import { assert } from "chai"

import { Configuration } from "./configuration.js"

suite("Configuration", function () {
  test("pathMapper", function () {
    const configFileContent = { globals: {} }
    const config = new Configuration(configFileContent)
    const pathMapper = config.pathMapper()
    assert.ok(pathMapper)
  })
})
