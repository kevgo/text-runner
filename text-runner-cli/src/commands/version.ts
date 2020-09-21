import * as events from "events"
import * as tr from "text-runner-core"
import * as path from "path"
import { promises as fs } from "fs"

export class VersionCommand extends events.EventEmitter implements tr.Command {
  async execute(): Promise<void> {
    const fileContent = await fs.readFile(path.join(__dirname, "../../package.json"), "utf-8")
    const pkg = JSON.parse(fileContent)
    this.emit("output", `TextRunner v${pkg.version}`)
  }
}
