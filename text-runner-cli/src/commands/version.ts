import { EventEmitter } from "events"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-engine"
import * as url from "url"

export class VersionCommand implements textRunner.commands.Command {
  emitter: EventEmitter

  constructor() {
    this.emitter = new EventEmitter()
  }

  emit(name: textRunner.events.Name, payload: textRunner.events.Args): void {
    this.emitter.emit(name, payload)
  }

  async execute(): Promise<void> {
    const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
    const fileContent = await fs.readFile(path.join(__dirname, "../../package.json"), "utf-8")
    const pkg = JSON.parse(fileContent)
    this.emit("output", `TextRunner v${pkg.version}`)
  }

  on(name: textRunner.events.Name, handler: textRunner.events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
