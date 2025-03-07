import { assert } from "chai"
import { suite, test } from "node:test"

import * as files from "../filesystem/index.js"
import { normalizeActionName } from "./normalize-action-name.js"

suite("normalizeActionName", () => {
  const tests = {
    "demo/hello-world": "demo/hello-world",
    "demo/HelloWorld": "demo/hello-world",
    "demo/helloWorld": "demo/hello-world",
    "hello-world": "hello-world",
    helloWorld: "hello-world",
    HelloWorld: "hello-world"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(give, () => {
      const location = new files.Location(new files.SourceDir(""), new files.FullFilePath(""), 1)
      assert.equal(normalizeActionName(give, location), want)
    })
  }
})
