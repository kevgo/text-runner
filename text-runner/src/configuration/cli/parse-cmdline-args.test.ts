import { assert } from "chai"
import { parseCmdlineArgs } from "./parse-cmdline-args"

suite("parseCmdlineArgs()", function () {
  test("with unix <node> call", function () {
    const { command, config } = parseCmdlineArgs([
      "/usr/local/Cellar/node/9.3.0_1/bin/node",
      "/Users/kevlar/d/text-runner/bin/text-run",
      "run",
    ])
    assert.equal(command, "run")
    assert.isUndefined(config.fileGlob)
  })

  test("with windows <node> call", function () {
    const { command, config } = parseCmdlineArgs([
      "C:\\Program Files (x86)\\nodejs\\node.exe",
      "C:\\projects\\text-runner\\bin\\text-run.cmd\\..\\..\\dist\\cli.js",
      "run",
    ])
    assert.equal(command, "run")
    assert.isUndefined(config.fileGlob)
  })

  test("with <node> and <text-run> call", function () {
    const { command, config } = parseCmdlineArgs([
      "/usr/local/Cellar/node/9.3.0_1/bin/node",
      "/Users/kevlar/d/text-runner/bin/text-run",
      "run",
    ])
    assert.equal(command, "run")
    assert.isUndefined(config.fileGlob)
  })

  test("with <text-run> call", function () {
    const { command, config } = parseCmdlineArgs(["/Users/kevlar/d/text-runner/bin/text-run", "run"])
    assert.equal(command, "run")
    assert.isUndefined(config.fileGlob)
  })

  test("--online <file>", function () {
    const { command, config } = parseCmdlineArgs(["--online", "documentation/actions/cd.md"])
    assert.equal(command, "run")
    assert.isTrue(config.online)
    assert.equal(config.fileGlob, "documentation/actions/cd.md")
  })

  test("<file>", function () {
    const { command, config } = parseCmdlineArgs(["documentation/actions/cd.md"])
    assert.equal(command, "run")
    assert.equal(config.fileGlob, "documentation/actions/cd.md")
  })

  test("(no args)", function () {
    const { command, config } = parseCmdlineArgs([])
    assert.equal(command, "run")
    assert.isUndefined(config.fileGlob)
  })

  test("--format dot", function () {
    const { command, config } = parseCmdlineArgs(["--format", "dot"])
    assert.equal(command, "run")
    assert.equal(config.formatterName, "dot")
  })

  test("--workspace foo/bar", function () {
    const { command, config } = parseCmdlineArgs(["--workspace", "foo/bar"])
    assert.equal(command, "run")
    assert.equal(config.workspace, "foo/bar")
  })
})
