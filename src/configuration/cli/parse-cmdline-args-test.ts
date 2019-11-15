import { assert } from "chai"
import { parseCmdlineArgs } from "./parse-cmdline-args"

suite("parseCmdlineArgs()", function() {
  test("with unix <node> call", function() {
    const result = parseCmdlineArgs([
      "/usr/local/Cellar/node/9.3.0_1/bin/node",
      "/Users/kevlar/d/text-runner/bin/text-run",
      "run"
    ])
    assert.equal(result.command, "run")
  })

  test("with windows <node> call", function() {
    const result = parseCmdlineArgs([
      "C:\\Program Files (x86)\\nodejs\\node.exe",
      "C:\\projects\\text-runner\\bin\\text-run.cmd\\..\\..\\dist\\cli.js",
      "run"
    ])
    assert.equal(result.command, "run")
    assert.isUndefined(result.fileGlob)
  })

  test("with <node> and <text-run> call", function() {
    const result = parseCmdlineArgs([
      "/usr/local/Cellar/node/9.3.0_1/bin/node",
      "/Users/kevlar/d/text-runner/bin/text-run",
      "run"
    ])
    assert.equal(result.command, "run")
  })

  test("with <text-run> call", function() {
    const result = parseCmdlineArgs([
      "/Users/kevlar/d/text-runner/bin/text-run",
      "run"
    ])
    assert.equal(result.command, "run")
  })

  test("--offline <file>", function() {
    const result = parseCmdlineArgs([
      "--offline",
      "documentation/actions/cd.md"
    ])
    assert.equal(result.command, "run")
    assert.isTrue(result.offline)
    assert.equal(result.fileGlob, "documentation/actions/cd.md")
  })

  test("<file>", function() {
    const result = parseCmdlineArgs(["documentation/actions/cd.md"])
    assert.equal(result.command, "run")
    assert.equal(result.fileGlob, "documentation/actions/cd.md")
  })

  test("(no args)", function() {
    const result = parseCmdlineArgs([])
    assert.equal(result.command, "run")
    assert.isUndefined(result.fileGlob)
  })

  test("--format dot", function() {
    const result = parseCmdlineArgs(["--format", "dot"])
    assert.equal(result.command, "run")
    assert.equal(result.formatterName, "dot")
  })

  test("--workspace foo/bar", function() {
    const result = parseCmdlineArgs(["--workspace", "foo/bar"])
    assert.equal(result.command, "run")
    assert.equal(result.workspace, "foo/bar")
  })

  test("--keep-tmp", function() {
    const result = parseCmdlineArgs(["--keep-tmp", "foo.md"])
    assert.equal(result.command, "run")
    assert.isTrue(result.keepTmp)
    assert.equal(result.fileGlob, "foo.md")
  })
})
