import { Configuration } from "./configuration"
import { assert } from "chai"

suite("Configuration", function () {
  test("pathMapper", function () {
    const configFileContent = { globals: {} }
    const config = new Configuration(configFileContent)
    const pathMapper = config.pathMapper()
    assert.ok(pathMapper)
  })
})
