import { EventEmitter } from "events"
import { Command } from "./command"

export class VersionCommand extends EventEmitter implements Command {
  async execute() {
    const { version } = require("../../package.json")
    this.emit(`TextRunner v${version}`)
  }
}
