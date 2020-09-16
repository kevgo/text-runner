import * as events from "events"
import * as tr from "text-runner-core"

export class VersionCommand extends events.EventEmitter implements tr.Command {
  async execute() {
    const { version } = require("../../package.json")
    this.emit("output", `TextRunner v${version}`)
  }
}
