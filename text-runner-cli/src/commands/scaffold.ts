import { EventEmitter } from "events"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

import * as helpers from "../helpers"

/** languages in which this Text-Runner actions can be scaffolded */
export type ScaffoldLanguage = "js" | "ts"

export class ScaffoldCommand implements tr.commands.Command {
  emitter: EventEmitter
  name: string
  sourceDir: string
  language: ScaffoldLanguage

  constructor(name: string, sourceDir: string, language: ScaffoldLanguage) {
    this.name = name
    this.sourceDir = sourceDir
    this.language = language
    this.emitter = new EventEmitter()
  }

  emit(name: tr.events.Name, payload: tr.events.Args): void {
    this.emitter.emit(name, payload)
  }

  async execute(): Promise<void> {
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

  on(name: tr.events.Name, handler: tr.events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}

function jsTemplate(filename: string) {
  return `module.exports = function ${helpers.camelize(filename)} (action) {
  console.log("This is the implementation of the "${filename}" action.")
  console.log('Text inside the semantic document region:', action.region.text())
  console.log("For more information see")
  console.log("https://github.com/kevgo/text-runner/blob/master/documentation/user-defined-actions.md")
}`
}

function tsTemplate(filename: string) {
  return `import * as tr from "text-runner"

export function ${helpers.camelize(filename)} (action: tr.actions.Args) {
  console.log("This is the implementation of the "${filename}" action.")
  console.log('Text inside the semantic document region:', action.region.text())
  console.log("For more information see")
  console.log("https://github.com/kevgo/text-runner/blob/master/documentation/user-defined-actions.md")
}`
}
