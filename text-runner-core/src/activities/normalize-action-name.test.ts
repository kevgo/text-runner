import { assert } from "chai"

import * as files from "../filesystem/index.js"
import { normalizeActionName } from "./normalize-action-name.js"

suite("normalizeActionName", function () {
  const tests = {
    "hello-world": "hello-world",
    helloWorld: "hello-world",
    HelloWorld: "hello-world",
    "demo/HelloWorld": "demo/hello-world",
    "demo/helloWorld": "demo/hello-world",
    "demo/hello-world": "demo/hello-world"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(give, function () {
      const location = new files.Location(new files.SourceDir(""), new files.FullFilePath(""), 1)
      assert.equal(normalizeActionName(give, location), want)
    })
  }
})
