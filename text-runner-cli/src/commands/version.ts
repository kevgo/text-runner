import * as tr from "text-runner-core"
import * as path from "path"
import { promises as fs } from "fs"
import { EventEmitter } from "events"

export class VersionCommand implements tr.commands.Command {
  emitter: EventEmitter

  constructor() {
    this.emitter = new EventEmitter()
  }

  emit(name: tr.events.Name, payload: tr.events.Args): void {
    this.emitter.emit(name, payload)
  }

  async execute(): Promise<void> {
    const fileContent = await fs.readFile(path.join(__dirname, "../../package.json"), "utf-8")
    const pkg = JSON.parse(fileContent)
    this.emit("output", `TextRunner v${pkg.version}`)
  }

  on(name: tr.events.Name, handler: tr.events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
