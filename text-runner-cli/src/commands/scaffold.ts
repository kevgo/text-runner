import { EventEmitter } from "events"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-core"

import * as helpers from "../helpers/index.js"

/** languages in which this Text-Runner actions can be scaffolded */
export type ScaffoldLanguage = "js" | "ts"

export class ScaffoldCommand implements textRunner.commands.Command {
  emitter: EventEmitter
  language: ScaffoldLanguage
  name: string
  sourceDir: string

  constructor(name: string, sourceDir: string, language: ScaffoldLanguage) {
    this.name = name
    this.sourceDir = sourceDir
    this.language = language
    this.emitter = new EventEmitter()
  }

  emit(name: textRunner.events.Name, payload: textRunner.events.Args): void {
    this.emitter.emit(name, payload)
  }

  async execute(): Promise<void> {
    const dirPath = path.join(this.sourceDir || ".", "text-runner")
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
      throw new textRunner.UserError(
        `Unknown configuration language: ${this.language}`,
        "Possible languages are \"js\" and \"ts\""
      )
    }
  }

  on(name: textRunner.events.Name, handler: textRunner.events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}

function jsTemplate(filename: string) {
  return `export default function ${helpers.camelize(filename)} (action) {
  console.log("This is the implementation of the "${filename}" action.")
  console.log('Text inside the semantic document region:', action.region.text())
  console.log("For more information see")
  console.log("https://github.com/kevgo/text-runner/blob/main/documentation/user-defined-actions.md")
}`
}

function tsTemplate(filename: string) {
  return `import * as textRunner from "text-runner"

export function ${helpers.camelize(filename)} (action: textRunner.actions.Args) {
  console.log("This is the implementation of the "${filename}" action.")
  console.log('Text inside the semantic document region:', action.region.text())
  console.log("For more information see")
  console.log("https://github.com/kevgo/text-runner/blob/main/documentation/user-defined-actions.md")
}`
}
