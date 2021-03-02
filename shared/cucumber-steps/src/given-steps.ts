import { Given } from "cucumber"
import { promises as fs } from "fs"
import * as fse from "fs-extra"
import * as path from "path"

import { TRWorld } from "./world"

Given("a broken file {string}", async function (filePath) {
  const world = this as TRWorld
  const subdir = path.dirname(filePath)
  if (subdir !== ".") {
    await fse.ensureDir(world.workspace.joinStr(subdir))
  }
  await fs.writeFile(
    world.workspace.joinStr(filePath),
    `
      <a href="missing">
      </a>
      `
  )
})

Given("a runnable file {string}", async function (filePath) {
  const world = this as TRWorld
  const subdir = path.dirname(filePath)
  if (subdir !== ".") {
    const subdirPath = path.join(world.workspace.joinStr(subdir))
    let subdirExists = false
    try {
      await fs.stat(subdirPath)
      subdirExists = true
    } catch (e) {
      // nothing to do here
    }
    if (!subdirExists) {
      await fs.mkdir(subdirPath)
    }
  }
  await fs.writeFile(world.workspace.joinStr(filePath), '<a type="test"></a>')
})

Given("I am in a directory that contains documentation without a configuration file", async function () {
  const world = this as TRWorld
  await fs.writeFile(world.workspace.joinStr("1.md"), '<code type="test"></code>')
})

Given("I am in a directory that contains the {string} example", async function (exampleName) {
  const world = this as TRWorld
  await fse.copy(path.join("documentation", "examples", exampleName), world.workspace.platformified())
})

Given(
  "I am in a directory that contains the {string} example with the configuration file:",
  async function (exampleName, configFileContent) {
    const world = this as TRWorld
    await fse.copy(path.join("documentation", "examples", exampleName), world.workspace.platformified())
    await fs.writeFile(world.workspace.joinStr("text-run.yml"), configFileContent)
  }
)

Given(
  "I am in a directory that contains the {string} example( without a configuration file)",
  async function (exampleName) {
    const world = this as TRWorld
    await fse.copy(path.join("documentation", "examples", exampleName), world.workspace.platformified())
  }
)

Given("the source code contains a directory {string}", function (dirName) {
  const world = this as TRWorld
  return fse.ensureDir(world.workspace.joinStr(dirName))
})

Given("the source code contains a file {string}", async function (fileName) {
  const world = this as TRWorld
  await fse.ensureDir(world.workspace.joinStr(path.dirname(fileName)))
  await fs.writeFile(world.workspace.joinStr(fileName), "content")
})

Given("the source code contains a file {string} with content:", async function (fileName, content) {
  const world = this as TRWorld
  await fse.ensureDir(world.workspace.joinStr(path.dirname(fileName)))
  await fs.writeFile(world.workspace.joinStr(fileName), content)
})

Given("the source code contains an executable {string}", async function (fileName) {
  const world = this as TRWorld
  await fse.ensureDir(world.workspace.joinStr(path.dirname(fileName)))
  await fs.writeFile(world.workspace.joinStr(fileName), "content", { mode: 0o744 })
})

Given("the workspace contains a file {string}", async function (fileName) {
  const world = this as TRWorld
  await fse.ensureDir(world.workspace.joinStr("tmp", path.dirname(fileName)))
  await fs.writeFile(world.workspace.joinStr("tmp", fileName), "content")
})

Given("the workspace contains a file {string} with content {string}", async function (fileName, content) {
  const world = this as TRWorld
  await fse.ensureDir(world.workspace.joinStr("tmp", path.dirname(fileName)))
  await fs.writeFile(world.workspace.joinStr("tmp", fileName), content)
})

Given("my workspace contains testable documentation", async function () {
  const world = this as TRWorld
  await fs.writeFile(
    world.workspace.joinStr("1.md"),
    `
<a type="test">
testable documentation
</a>
    `
  )
})

Given("the source code contains the HelloWorld action", async function () {
  const world = this as TRWorld
  await fse.ensureDir(world.workspace.joinStr("text-run"))
  await fs.writeFile(
    world.workspace.joinStr("text-run", "hello-world.js"),
    `
    module.exports = function (action) { action.log('Hello World!') }`
  )
})

Given("the workspace contains a file {string} with content:", async function (fileName, content) {
  const world = this as TRWorld
  await fse.ensureDir(world.workspace.joinStr("tmp", path.dirname(fileName)))
  await fs.writeFile(world.workspace.joinStr("tmp", fileName), content)
})

Given("the text-run configuration contains:", async function (text: string) {
  const world = this as TRWorld
  await fs.appendFile(world.workspace.joinStr("text-run.yml"), `\n${text}`)
})

Given("the workspace contains a directory {string}", async function (dir) {
  const world = this as TRWorld
  await fse.ensureDir(world.workspace.joinStr("tmp", dir))
})

Given("the workspace contains an empty file {string}", async function (fileName) {
  const world = this as TRWorld
  await fs.writeFile(world.workspace.joinStr(fileName), "")
})

Given("the workspace contains an image {string}", async function (imageName) {
  const world = this as TRWorld
  await fse.ensureDir(world.workspace.joinStr(path.dirname(imageName)))
  await fs.copyFile(path.join(__dirname, "..", path.basename(imageName)), world.workspace.joinStr(imageName))
})

Given("the configuration file:", async function (content) {
  const world = this as TRWorld
  await fs.writeFile(world.workspace.joinStr("text-run.yml"), content)
})
