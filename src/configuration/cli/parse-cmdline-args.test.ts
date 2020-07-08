import { assert } from "chai"
import { parseCmdlineArgs } from "./parse-cmdline-args"

suite("parseCmdlineArgs()", function () {
  test("with unix <node> call", function () {
    const args = parseCmdlineArgs([
      "/usr/local/Cellar/node/9.3.0_1/bin/node",
      "/Users/kevlar/d/text-runner/bin/text-run",
      "run",
    ])
    assert.equal(args.command, "run")
    assert.isUndefined(args.fileGlob)
  })

  test("with windows <node> call", function () {
    const args = parseCmdlineArgs([
      "C:\\Program Files (x86)\\nodejs\\node.exe",
      "C:\\projects\\text-runner\\bin\\text-run.cmd\\..\\..\\dist\\cli.js",
      "run",
    ])
    assert.equal(args.command, "run")
    assert.isUndefined(args.fileGlob)
  })

  test("with <node> and <text-run> call", function () {
    const args = parseCmdlineArgs([
      "/usr/local/Cellar/node/9.3.0_1/bin/node",
      "/Users/kevlar/d/text-runner/bin/text-run",
      "run",
    ])
    assert.equal(args.command, "run")
    assert.isUndefined(args.fileGlob)
  })

  test("with <text-run> call", function () {
    const args = parseCmdlineArgs(["/Users/kevlar/d/text-runner/bin/text-run", "run"])
    assert.equal(args.command, "run")
    assert.isUndefined(args.fileGlob)
  })

  test("--offline <file>", function () {
    const args = parseCmdlineArgs(["--offline", "documentation/actions/cd.md"])
    assert.equal(args.command, "run")
    assert.isTrue(args.offline)
    assert.equal(args.fileGlob, "documentation/actions/cd.md")
  })

  test("<file>", function () {
    const args = parseCmdlineArgs(["documentation/actions/cd.md"])
    assert.equal(args.command, "run")
    assert.equal(args.fileGlob, "documentation/actions/cd.md")
  })

  test("(no args)", function () {
    const args = parseCmdlineArgs([])
    assert.equal(args.command, "run")
    assert.isUndefined(args.fileGlob)
  })

  test("--format dot", function () {
    const args = parseCmdlineArgs(["--format", "dot"])
    assert.equal(args.command, "run")
    assert.equal(args.formatterName, "dot")
  })

  test("--workspace foo/bar", function () {
    const args = parseCmdlineArgs(["--workspace", "foo/bar"])
    assert.equal(args.command, "run")
    assert.equal(args.workspace, "foo/bar")
  })

  test("--keep-tmp", function () {
    const args = parseCmdlineArgs(["--keep-tmp", "foo.md"])
    assert.equal(args.command, "run")
    assert.isTrue(args.keepTmp)
    assert.equal(args.fileGlob, "foo.md")
  })
})
