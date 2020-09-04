import { Given } from "cucumber"
import * as fse from "fs-extra"
import { promises as fs } from "fs"
import * as path from "path"
import { TRWorld } from "./world"

Given("a broken file {string}", async function (filePath) {
  const world = this as TRWorld
  const subdir = path.dirname(filePath)
  if (subdir !== ".") {
    await fse.ensureDir(path.join(world.rootDir, subdir))
  }
  await fs.writeFile(
    path.join(world.rootDir, filePath),
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
    const subdirPath = path.join(world.rootDir, subdir)
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
  await fs.writeFile(path.join(world.rootDir, filePath), '<a type="test"></a>')
})

Given("I am in a directory that contains documentation without a configuration file", async function () {
  const world = this as TRWorld
  await fs.writeFile(path.join(world.rootDir, "1.md"), '<code type="test"></code>')
})

Given("I am in a directory that contains the {string} example", async function (exampleName) {
  const world = this as TRWorld
  await fse.copy(path.join("documentation", "examples", exampleName), world.rootDir)
})

Given("I am in a directory that contains the {string} example with the configuration file:", async function (
  exampleName,
  configFileContent
) {
  const world = this as TRWorld
  await fse.copy(path.join("documentation", "examples", exampleName), world.rootDir)
  await fs.writeFile(path.join(world.rootDir, "text-run.yml"), configFileContent)
})

Given("I am in a directory that contains the {string} example( without a configuration file)", async function (
  exampleName
) {
  const world = this as TRWorld
  await fse.copy(path.join("documentation", "examples", exampleName), world.rootDir)
})

Given("the source code contains a directory {string}", function (dirName) {
  const world = this as TRWorld
  return fse.ensureDir(path.join(world.rootDir, dirName))
})

Given("the source code contains a file {string}", async function (fileName) {
  const world = this as TRWorld
  await fse.ensureDir(path.join(world.rootDir, path.dirname(fileName)))
  await fs.writeFile(path.join(world.rootDir, fileName), "content")
})

Given("the source code contains a file {string} with content:", async function (fileName, content) {
  const world = this as TRWorld
  await fse.ensureDir(path.join(world.rootDir, path.dirname(fileName)))
  await fs.writeFile(path.join(world.rootDir, fileName), content)
})

Given("the workspace contains a file {string}", async function (fileName) {
  const world = this as TRWorld
  await fse.ensureDir(path.join(world.rootDir, "tmp", path.dirname(fileName)))
  await fs.writeFile(path.join(world.rootDir, "tmp", fileName), "content")
})

Given("the workspace contains a file {string} with content {string}", async function (fileName, content) {
  const world = this as TRWorld
  await fse.ensureDir(path.join(world.rootDir, "tmp", path.dirname(fileName)))
  await fs.writeFile(path.join(world.rootDir, "tmp", fileName), content)
})

Given("my workspace contains testable documentation", async function () {
  const world = this as TRWorld
  await fs.writeFile(
    path.join(world.rootDir, "1.md"),
    `
<a type="test">
testable documentation
</a>
    `
  )
})

Given("the source code contains the HelloWorld action", async function () {
  const world = this as TRWorld
  await fse.ensureDir(path.join(world.rootDir, "text-run"))
  await fs.writeFile(
    path.join(world.rootDir, "text-run", "hello-world.js"),
    `
    module.exports = function (action) { action.log('Hello World!') }`
  )
})

Given("the workspace contains a file {string} with content:", async function (fileName, content) {
  const world = this as TRWorld
  await fse.ensureDir(path.join(world.rootDir, "tmp", path.dirname(fileName)))
  await fs.writeFile(path.join(world.rootDir, "tmp", fileName), content)
})

Given("the text-run configuration contains:", async function (text) {
  const world = this as TRWorld
  await fs.appendFile(path.join(world.rootDir, "text-run.yml"), `\n${text}`)
})

Given("the workspace contains a directory {string}", async function (dir) {
  const world = this as TRWorld
  await fse.ensureDir(path.join(world.rootDir, "tmp", dir))
})

Given("the workspace contains an empty file {string}", async function (fileName) {
  const world = this as TRWorld
  await fs.writeFile(path.join(world.rootDir, fileName), "")
})

Given("the workspace contains an image {string}", async function (imageName) {
  const world = this as TRWorld
  await fse.ensureDir(path.join(world.rootDir, path.dirname(imageName)))
  fs.copyFile(path.join(__dirname, "..", path.basename(imageName)), path.join(world.rootDir, imageName))
})

Given("the configuration file:", async function (content) {
  const world = this as TRWorld
  await fs.writeFile(path.join(world.rootDir, "text-run.yml"), content)
})
