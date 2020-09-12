import * as path from "path"
import { promises as fs } from "fs"
import { camelize } from "../helpers/camelize"
import { EventEmitter } from "events"
import { Command } from "./command"
import { Configuration } from "../configuration/configuration"
import { UserError } from "../errors/user-error"

export type ScaffoldLanguage = "js" | "ts"

export class ScaffoldCommand extends EventEmitter implements Command {
  config: Configuration

  constructor(config: Configuration) {
    super()
    this.config = config
  }

  async execute() {
    if (!this.config.files) {
      throw new Error("no action name given")
    }
    const dirPath = path.join(this.config.sourceDir || ".", "text-run")
    let textRunDirExists = true
    try {
      await fs.stat(dirPath)
    } catch (e) {
      textRunDirExists = false
    }
    if (!textRunDirExists) {
      await fs.mkdir(dirPath, { recursive: true })
    }
    if (this.config.scaffoldLanguage === "ts") {
      await fs.writeFile(path.join(dirPath, this.config.files + ".ts"), tsTemplate(this.config.files), "utf8")
    } else if (this.config.scaffoldLanguage === "js") {
      await fs.writeFile(path.join(dirPath, this.config.files + ".js"), jsTemplate(this.config.files), "utf8")
    } else {
      throw new UserError(`Unknown configuration language: ${this.config.scaffoldLanguage}`,
      'Possible languages are "js" and "ts"')
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
  return `import { ActionArgs } from "text-runner"

export function ${camelize(filename)} (action: ActionArgs) {
  console.log("This is the implementation of the "${filename}" action.")
  console.log('Text inside the semantic document region:', action.region.text())
  console.log("For more information see")
  console.log("https://github.com/kevgo/text-runner/blob/master/documentation/user-defined-actions.md")
}`
}
