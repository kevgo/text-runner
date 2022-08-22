import * as color from "colorette"
import { EventEmitter } from "events"
import * as textRunner from "text-runner-core"

import * as configFile from "../config-file.js"
import * as config from "../configuration.js"

export class SetupCommand implements textRunner.commands.Command {
  config: config.Data
  emitter: EventEmitter

  constructor(config: config.Data) {
    this.config = config
    this.emitter = new EventEmitter()
  }

  emit(name: textRunner.events.Name, payload: textRunner.events.Args): void {
    this.emitter.emit(name, payload)
  }

  async execute(): Promise<void> {
    await configFile.create(this.config)
    this.emit("output", `Created configuration file ${color.cyan("text-run.yml")} with default values`)
  }

  on(name: textRunner.events.Name, handler: textRunner.events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
