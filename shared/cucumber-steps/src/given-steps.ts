import { Given } from "@cucumber/cucumber"
import { promises as fs } from "fs"
import * as path from "path"
import * as url from "url"

import * as workspace from "./helpers/workspace.js"
import { TRWorld } from "./world.js"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

Given("a broken file {string}", async function(this: TRWorld, filePath: string) {
  const subdir = path.dirname(filePath)
  if (subdir !== ".") {
    await fs.mkdir(workspace.absPath.joinStr(subdir), { recursive: true })
  }
  await fs.writeFile(
    workspace.absPath.joinStr(filePath),
    `
      <a href="missing">
      </a>
      `
  )
})

Given("a runnable file {string}", async function(this: TRWorld, filePath: string) {
  const subdir = path.dirname(filePath)
  if (subdir !== ".") {
    const subdirPath = workspace.absPath.joinStr(subdir)
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
  await fs.writeFile(workspace.absPath.joinStr(filePath), '<a type="test"></a>')
})

Given("I am in a directory that contains documentation without a configuration file", async function(this: TRWorld) {
  await fs.writeFile(workspace.absPath.joinStr("1.md"), '<code type="test"></code>')
})

Given("I am in a directory that contains the {string} example", async function(this: TRWorld, exampleName: string) {
  const exampleDir = path.join("documentation", "examples", exampleName)
  await fs.cp(exampleDir, workspace.absPath.platformified(), { recursive: true })
})

Given(
  "I am in a directory that contains the {string} example with the configuration file:",
  async function(this: TRWorld, exampleName: string, configFileContent: string) {
    const exampleDir = path.join("documentation", "examples", exampleName)
    await fs.cp(exampleDir, workspace.absPath.platformified(), { recursive: true })
    const configFilePath = workspace.absPath.joinStr("text-runner.jsonc")
    await fs.writeFile(configFilePath, configFileContent)
  }
)

Given(
  "I am in a directory that contains the {string} example( without a configuration file)",
  async function(this: TRWorld, exampleName: string) {
    const exampleDir = path.join("documentation", "examples", exampleName)
    await fs.cp(exampleDir, workspace.absPath.platformified(), {
      recursive: true
    })
  }
)

Given("the source code contains a directory {string}", function(this: TRWorld, dirName: string) {
  const sourceRoot = workspace.absPath
  const fileDir = sourceRoot.joinStr(dirName)
  return fs.mkdir(fileDir, { recursive: true })
})

Given("the source code contains a file {string}", async function(this: TRWorld, fileName: string) {
  const sourceRoot = workspace.absPath
  const fileDir = sourceRoot.joinStr(path.dirname(fileName))
  await fs.mkdir(fileDir, { recursive: true })
  const filePath = sourceRoot.joinStr(fileName)
  await fs.writeFile(filePath, "content")
})

Given(
  "the source code contains a file {string} with content:",
  async function(this: TRWorld, fileName: string, content: string) {
    const sourceRoot = workspace.absPath
    const fileDir = sourceRoot.joinStr(path.dirname(fileName))
    await fs.mkdir(fileDir, { recursive: true })
    const filePath = sourceRoot.joinStr(fileName)
    await fs.writeFile(filePath, content)
  }
)

Given("the source code contains an executable {string}", async function(this: TRWorld, fileName: string) {
  const sourceRoot = workspace.absPath
  const fileDir = sourceRoot.joinStr(path.dirname(fileName))
  await fs.mkdir(fileDir, { recursive: true })
  const filePath = sourceRoot.joinStr(fileName)
  await fs.writeFile(filePath, "content", { mode: 0o744 })
})

Given("the workspace contains a file {string}", async function(this: TRWorld, fileName: string) {
  const workspaceRoot = workspace.absPath.joinStr("tmp")
  const fileDir = path.join(workspaceRoot, path.dirname(fileName))
  await fs.mkdir(fileDir, { recursive: true })
  const filePath = path.join(workspaceRoot, fileName)
  await fs.writeFile(filePath, "content")
})

Given(
  "the workspace contains a file {string} with content {string}",
  async function(this: TRWorld, fileName: string, content: string) {
    const workspaceRoot = workspace.absPath.joinStr("tmp")
    const fileDir = path.join(workspaceRoot, path.dirname(fileName))
    await fs.mkdir(fileDir, { recursive: true })
    const filePath = path.join(workspaceRoot, fileName)
    await fs.writeFile(filePath, content)
  }
)

Given("my workspace contains testable documentation", async function(this: TRWorld) {
  await fs.writeFile(
    workspace.absPath.joinStr("1.md"),
    `
<a type="test">
testable documentation
</a>
    `
  )
})

Given("the source code contains the HelloWorld action", async function(this: TRWorld) {
  const actionDir = workspace.absPath.joinStr("text-runner")
  await fs.mkdir(actionDir, { recursive: true })
  const actionFile = path.join(actionDir, "hello-world.js")
  await fs.writeFile(actionFile, `export default (action) => action.log('Hello World!')`)
})

Given(
  "the workspace contains a file {string} with content:",
  async function(this: TRWorld, fileName: string, content: string) {
    const workspaceRoot = workspace.absPath.joinStr("tmp")
    const fileDir = path.join(workspaceRoot,path.dirname(fileName))
    await fs.mkdir(fileDir, { recursive: true })
    const filePath = path.join(workspaceRoot, fileName)
    await fs.writeFile(filePath, content)
  }
)

Given("the text-runner configuration contains:", async function(this: TRWorld, text: string) {
  await fs.appendFile(workspace.absPath.joinStr("text-runner.jsonc"), `\n${text}`)
})

Given("the workspace contains a directory {string}", async function(this: TRWorld, dir: string) {
  await fs.mkdir(workspace.absPath.joinStr("tmp", dir), { recursive: true })
})

Given("the workspace contains an empty file {string}", async function(this: TRWorld, fileName: string) {
  await fs.writeFile(workspace.absPath.joinStr(fileName), "")
})

Given("the source code contains an image {string}", async function(this: TRWorld, imageName: string) {
    const sourceRoot = workspace.absPath
    const imgDir = sourceRoot.joinStr(path.dirname(imageName))
  await fs.mkdir(imgDir, { recursive: true })
  const imgPath = sourceRoot.joinStr(imageName)
  await fs.copyFile(path.join(__dirname, "..", path.basename(imageName)), imgPath)
})

Given("the configuration file:", async function(this: TRWorld, content: string) {
  await fs.writeFile(workspace.absPath.joinStr("text-runner.jsonc"), content)
})
