import * as events from "../events/index.js"

/** Command describes a Text-Runner command */
export interface Command {
  emit(event: events.Name, payload: events.Args): void
  /** executes this command */
  execute(): Promise<void>
  on(event: events.Name, handler: events.Handler): void
}
