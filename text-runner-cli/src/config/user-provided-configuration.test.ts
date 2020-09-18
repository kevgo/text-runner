import { assert } from "chai"
import { Publications } from "text-runner-core"
import { UserConfigurationBuilder, UserProvidedConfiguration } from "./user-provided-configuration"

suite("UserProvidedConfiguration", function () {
  suite("merge", function () {
    test("empty inputs", function () {
      const config = new UserConfigurationBuilder({})
      const have = config.merge({}).data()
      assert.deepEqual(have, { publications: new Publications() })
    })

    test("config file data given", function () {
      const config = new UserConfigurationBuilder({})
      const give: UserProvidedConfiguration = {
        exclude: "1.md",
        sourceDir: "my-source",
      }
      const have = config.merge(give).data()
      const want: UserProvidedConfiguration = {
        exclude: "1.md",
        publications: new Publications(),
        sourceDir: "my-source",
      }
      assert.deepEqual(have, want)
    })

    test("userConfig overrides fileConfig", function () {
      const config = new UserConfigurationBuilder({
        formatterName: "dot",
        files: "**/*.md",
        online: true,
      })
      const give: UserProvidedConfiguration = {
        files: "1.md",
        online: false,
      }
      const result = config.merge(give).data()
      assert.deepEqual(result, {
        formatterName: "dot",
        files: "1.md",
        online: false,
        publications: new Publications(),
      })
    })
  })
})
