import { Given } from "@cucumber/cucumber"
import { promises as fs } from "fs"
import * as fse from "fs-extra"
import * as path from "path"
import * as url from "url"

import { TRWorld } from "./world.js"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

Given("a broken file {string}", async function (this: TRWorld, filePath: string) {
  const subdir = path.dirname(filePath)
  if (subdir !== ".") {
    await fse.ensureDir(this.workspace.joinStr(subdir))
  }
  await fs.writeFile(
    this.workspace.joinStr(filePath),
    `
      <a href="missing">
      </a>
      `
  )
})

Given("a runnable file {string}", async function (this: TRWorld, filePath: string) {
  const subdir = path.dirname(filePath)
  if (subdir !== ".") {
    const subdirPath = path.join(this.workspace.joinStr(subdir))
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
  await fs.writeFile(this.workspace.joinStr(filePath), '<a type="test"></a>')
})

Given("I am in a directory that contains documentation without a configuration file", async function (this: TRWorld) {
  await fs.writeFile(this.workspace.joinStr("1.md"), '<code type="test"></code>')
})

Given("I am in a directory that contains the {string} example", async function (this: TRWorld, exampleName: string) {
  await fse.copy(path.join("documentation", "examples", exampleName), this.workspace.platformified())
})

Given(
  "I am in a directory that contains the {string} example with the configuration file:",
  async function (this: TRWorld, exampleName: string, configFileContent: string) {
    await fse.copy(path.join("documentation", "examples", exampleName), this.workspace.platformified())
    await fs.writeFile(this.workspace.joinStr("text-run.yml"), configFileContent)
  }
)

Given(
  "I am in a directory that contains the {string} example( without a configuration file)",
  async function (this: TRWorld, exampleName: string) {
    await fse.copy(path.join("documentation", "examples", exampleName), this.workspace.platformified())
  }
)

Given("the source code contains a directory {string}", function (this: TRWorld, dirName: string) {
  return fse.ensureDir(this.workspace.joinStr(dirName))
})

Given("the source code contains a file {string}", async function (this: TRWorld, fileName: string) {
  await fse.ensureDir(this.workspace.joinStr(path.dirname(fileName)))
  await fs.writeFile(this.workspace.joinStr(fileName), "content")
})

Given(
  "the source code contains a file {string} with content:",
  async function (this: TRWorld, fileName: string, content: string) {
    await fse.ensureDir(this.workspace.joinStr(path.dirname(fileName)))
    await fs.writeFile(this.workspace.joinStr(fileName), content)
  }
)

Given("the source code contains an executable {string}", async function (this: TRWorld, fileName: string) {
  await fse.ensureDir(this.workspace.joinStr(path.dirname(fileName)))
  await fs.writeFile(this.workspace.joinStr(fileName), "content", { mode: 0o744 })
})

Given("the workspace contains a file {string}", async function (this: TRWorld, fileName: string) {
  await fse.ensureDir(this.workspace.joinStr("tmp", path.dirname(fileName)))
  await fs.writeFile(this.workspace.joinStr("tmp", fileName), "content")
})

Given(
  "the workspace contains a file {string} with content {string}",
  async function (this: TRWorld, fileName: string, content: string) {
    await fse.ensureDir(this.workspace.joinStr("tmp", path.dirname(fileName)))
    await fs.writeFile(this.workspace.joinStr("tmp", fileName), content)
  }
)

Given("my workspace contains testable documentation", async function (this: TRWorld) {
  await fs.writeFile(
    this.workspace.joinStr("1.md"),
    `
<a type="test">
testable documentation
</a>
    `
  )
})

Given("the source code contains the HelloWorld action", async function (this: TRWorld) {
  await fse.ensureDir(this.workspace.joinStr("text-run"))
  await fs.writeFile(
    this.workspace.joinStr("text-run", "hello-world.js"),
    `
    module.exports = function (action) { action.log('Hello World!') }`
  )
})

Given(
  "the workspace contains a file {string} with content:",
  async function (this: TRWorld, fileName: string, content: string) {
    await fse.ensureDir(this.workspace.joinStr("tmp", path.dirname(fileName)))
    await fs.writeFile(this.workspace.joinStr("tmp", fileName), content)
  }
)

Given("the text-run configuration contains:", async function (this: TRWorld, text: string) {
  await fs.appendFile(this.workspace.joinStr("text-run.yml"), `\n${text}`)
})

Given("the workspace contains a directory {string}", async function (this: TRWorld, dir: string) {
  await fse.ensureDir(this.workspace.joinStr("tmp", dir))
})

Given("the workspace contains an empty file {string}", async function (this: TRWorld, fileName: string) {
  await fs.writeFile(this.workspace.joinStr(fileName), "")
})

Given("the workspace contains an image {string}", async function (this: TRWorld, imageName: string) {
  await fse.ensureDir(this.workspace.joinStr(path.dirname(imageName)))
  await fs.copyFile(path.join(__dirname, "..", path.basename(imageName)), this.workspace.joinStr(imageName))
})

Given("the configuration file:", async function (this: TRWorld, content: string) {
  await fs.writeFile(this.workspace.joinStr("text-run.yml"), content)
})
