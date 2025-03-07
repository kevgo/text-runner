import { strict as assert } from "assert"
import { suite, test } from "node:test"

import { dirPath } from "./workspace.js"

suite("dirPath", function() {
  const __dirname = "/home/foo/text-runner/shared/cucumber-steps/src/helpers"
  const tests = {
    "/home/foo/text-runner/text-runner-cli": "/home/foo/text-runner/test/cli",
    "/home/foo/text-runner/text-runner-engine": "/home/foo/text-runner/test/engine",
    "/home/foo/text-runner/text-runner-features": "/home/foo/text-runner/test/features_1",
    "/home/foo/text-runner/textrun-action": "/home/foo/text-runner/test/action",
    "/home/foo/text-runner/textrun-extension": "/home/foo/text-runner/test/extension"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function() {
      const have = dirPath(give, __dirname, "1")
      assert.equal(have, want)
    })
  }
})
