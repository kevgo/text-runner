import { Configuration } from "./configuration"
import { strict as assert } from "assert"

suite("Configuration", function () {
  test("pathMapper", function () {
    const configFileContent = { globals: {} }
    const config = new Configuration(configFileContent)
    const pathMapper = config.pathMapper()
    assert.ok(pathMapper)
  })
})
