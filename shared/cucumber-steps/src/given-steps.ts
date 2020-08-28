import { Given } from "cucumber"
import * as fse from "fs-extra"
import { promises as fs } from "fs"
import * as path from "path"
import { cp } from "shelljs"

Given("a broken file {string}", async function (filePath) {
  const subdir = path.dirname(filePath)
  if (subdir !== ".") {
    await fse.ensureDir(path.join(this.rootDir, subdir))
  }
  await fs.writeFile(
    path.join(this.rootDir, filePath),
    `
      <a href="missing">
      </a>
      `
  )
})

Given("a runnable file {string}", async function (filePath) {
  const subdir = path.dirname(filePath)
  if (subdir !== ".") {
    const subdirPath = path.join(this.rootDir, subdir)
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
  await fs.writeFile(path.join(this.rootDir, filePath), '<a type="test"></a>')
})

Given("I am in a directory that contains documentation without a configuration file", async function () {
  await fs.writeFile(path.join(this.rootDir, "1.md"), '<code type="test"></code>')
})

Given("I am in a directory that contains the {string} example", async function (exampleName) {
  await fse.copy(path.join("documentation", "examples", exampleName), this.rootDir)
})

Given("I am in a directory that contains the {string} example with the configuration file:", async function (
  exampleName,
  configFileContent
) {
  await fse.copy(path.join("documentation", "examples", exampleName), this.rootDir)
  await fs.writeFile(path.join(this.rootDir, "text-run.yml"), configFileContent)
})

Given("I am in a directory that contains the {string} example( without a configuration file)", async function (
  exampleName
) {
  await fse.copy(path.join("documentation", "examples", exampleName), this.rootDir)
})

Given("the source code contains a directory {string}", function (dirName) {
  return fse.ensureDir(path.join(this.rootDir, dirName))
})

Given("the source code contains a file {string}", async function (fileName) {
  await fse.ensureDir(path.join(this.rootDir, path.dirname(fileName)))
  await fs.writeFile(path.join(this.rootDir, fileName), "content")
})

Given("the source code contains a file {string} with content:", async function (fileName, content) {
  await fse.ensureDir(path.join(this.rootDir, path.dirname(fileName)))
  await fs.writeFile(path.join(this.rootDir, fileName), content)
})

Given("the workspace contains a file {string}", async function (fileName) {
  await fse.ensureDir(path.join(this.rootDir, "tmp", path.dirname(fileName)))
  await fs.writeFile(path.join(this.rootDir, "tmp", fileName), "content")
})

Given("the workspace contains a file {string} with content {string}", async function (fileName, content) {
  await fse.ensureDir(path.join(this.rootDir, "tmp", path.dirname(fileName)))
  await fs.writeFile(path.join(this.rootDir, "tmp", fileName), content)
})

Given("my workspace contains testable documentation", async function () {
  await fs.writeFile(
    path.join(this.rootDir, "1.md"),
    `
<a type="test">
testable documentation
</a>
    `
  )
})

Given("the source code contains the HelloWorld action", async function () {
  await fse.ensureDir(path.join(this.rootDir, "text-run"))
  await fs.writeFile(
    path.join(this.rootDir, "text-run", "hello-world.js"),
    `
    module.exports = function (action) { action.log('Hello World!') }`
  )
})

Given("the workspace contains a file {string} with content:", async function (fileName, content) {
  await fse.ensureDir(path.join(this.rootDir, "tmp", path.dirname(fileName)))
  await fs.writeFile(path.join(this.rootDir, "tmp", fileName), content)
})

Given("the text-run configuration contains:", async function (text) {
  await fs.appendFile(path.join(this.rootDir, "text-run.yml"), `\n${text}`)
})

Given("the workspace contains a directory {string}", async function (dir) {
  await fse.ensureDir(path.join(this.rootDir, "tmp", dir))
})

Given("the workspace contains an empty file {string}", async function (fileName) {
  await fs.writeFile(path.join(this.rootDir, fileName), "")
})

Given("the workspace contains an image {string}", async function (imageName) {
  await fse.ensureDir(path.join(this.rootDir, path.dirname(imageName)))
  cp(path.join(__dirname, "..", path.basename(imageName)), path.join(this.rootDir, imageName))
})

Given("the configuration file:", async function (content) {
  await fs.writeFile(path.join(this.rootDir, "text-run.yml"), content)
})
