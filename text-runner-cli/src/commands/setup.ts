import { EventEmitter } from "events"
import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

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
    this.emit("output", `Created configuration file ${styleText("cyan", "text-runner.jsonc")} with default values`)
  }

  on(name: textRunner.events.Name, handler: textRunner.events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
