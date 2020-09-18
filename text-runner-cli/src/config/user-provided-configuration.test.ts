import { assert } from "chai"
import { UserProvidedConfiguration } from "./user-provided-configuration"

suite("UserProvidedConfiguration", function () {
  suite("merge", function () {
    test("empty inputs", function () {
      const config = new UserProvidedConfiguration()
      const have = config.merge(new UserProvidedConfiguration())
      const want = new UserProvidedConfiguration()
      assert.deepEqual(have, want)
    })

    test("userConfig overrides fileConfig", function () {
      const config = new UserProvidedConfiguration({
        formatterName: "dot",
        files: "**/*.md",
        online: true,
      })
      const other = new UserProvidedConfiguration({
        files: "1.md",
        online: false,
      })
      const result = config.merge(other)
      assert.deepEqual(
        result,
        new UserProvidedConfiguration({
          formatterName: "dot",
          files: "1.md",
          online: false,
        })
      )
    })
  })
})
