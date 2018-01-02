// @flow

declare interface Command {
  run(): Promise<?ErrnoError>
}
