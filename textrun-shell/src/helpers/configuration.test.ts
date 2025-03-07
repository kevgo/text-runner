import { assert } from "chai"
import { suite, test } from "node:test"

import { Configuration } from "./configuration.js"

suite("Configuration", () => {
  test("pathMapper", () => {
    const configFileContent = { globals: {} }
    const config = new Configuration(configFileContent)
    const pathMapper = config.pathMapper()
    assert.ok(pathMapper)
  })
})
