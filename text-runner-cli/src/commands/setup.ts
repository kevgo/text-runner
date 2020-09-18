import * as color from "colorette"
import { createConfigurationFile } from "../config-file/create-configuration-file"
import * as events from "events"
import * as tr from "text-runner-core"

export class SetupCommand extends events.EventEmitter implements tr.Command {
  sourceDir: string

  constructor(sourceDir: string) {
    super()
    this.sourceDir = sourceDir
  }

  async execute() {
    await createConfigurationFile(this.sourceDir || ".")
    this.emit(tr.CommandEvent.output, `Created configuration file ${color.cyan("text-run.yml")} with default values`)
  }
}
