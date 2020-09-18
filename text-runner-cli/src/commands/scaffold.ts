import * as path from "path"
import { promises as fs } from "fs"
import * as events from "events"
import * as tr from "text-runner-core"
import { camelize } from "../helpers/camelize"

export type ScaffoldLanguage = "js" | "ts"

export class ScaffoldCommand extends events.EventEmitter implements tr.Command {
  name: string
  sourceDir: string
  language: ScaffoldLanguage

  constructor(name: string, sourceDir: string, language: ScaffoldLanguage) {
    super()
    this.name = name
    this.sourceDir = sourceDir
    this.language = language
  }

  async execute() {
    const dirPath = path.join(this.sourceDir || ".", "text-run")
    let textRunDirExists = true
    try {
      await fs.stat(dirPath)
    } catch (e) {
      textRunDirExists = false
    }
    if (!textRunDirExists) {
      await fs.mkdir(dirPath, { recursive: true })
    }
    if (this.language === "ts") {
      await fs.writeFile(path.join(dirPath, this.name + ".ts"), tsTemplate(this.name), "utf8")
    } else if (this.language === "js") {
      await fs.writeFile(path.join(dirPath, this.name + ".js"), jsTemplate(this.name), "utf8")
    } else {
      throw new tr.UserError(`Unknown configuration language: ${this.language}`, 'Possible languages are "js" and "ts"')
    }
  }
}

function jsTemplate(filename: string) {
  return `module.exports = function ${camelize(filename)} (action) {
  console.log("This is the implementation of the "${filename}" action.")
  console.log('Text inside the semantic document region:', action.region.text())
  console.log("For more information see")
  console.log("https://github.com/kevgo/text-runner/blob/master/documentation/user-defined-actions.md")
}`
}

function tsTemplate(filename: string) {
  return `import * as tr from "text-runner-core"

export function ${camelize(filename)} (action: tr.ActionArgs) {
  console.log("This is the implementation of the "${filename}" action.")
  console.log('Text inside the semantic document region:', action.region.text())
  console.log("For more information see")
  console.log("https://github.com/kevgo/text-runner/blob/master/documentation/user-defined-actions.md")
}`
}
