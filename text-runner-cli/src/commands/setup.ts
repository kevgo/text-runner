import * as color from "colorette"
import * as tr from "text-runner-core"
import * as config from "../configuration"
import * as configFile from "../config-file"
import { EventEmitter } from "events"

export class SetupCommand implements tr.commands.Command {
  config: config.Data
  emitter: EventEmitter

  constructor(config: config.Data) {
    this.config = config
    this.emitter = new EventEmitter()
  }

  emit(name: tr.events.Name, payload: tr.events.Args): void {
    this.emitter.emit(name, payload)
  }

  async execute(): Promise<void> {
    await configFile.create(this.config)
    this.emit("output", `Created configuration file ${color.cyan("text-run.yml")} with default values`)
  }

  on(name: tr.events.Name, handler: tr.events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
