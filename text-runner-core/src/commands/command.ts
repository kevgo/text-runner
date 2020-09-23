import * as events from "../events/index"

/** Command describes a Text-Runner command */
export interface Command {
  /** executes this command */
  execute(): void
  on(event: events.CommandEvent, handler: events.Handler): void
  emit(event: events.CommandEvent, payload: events.Args): void
}
