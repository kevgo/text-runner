export { instantiate } from "./instantiate.js"
export * from "./scaffold.js"

/** returns a list of all available commands */
export function names(): string[] {
  return ["debug", "dynamic", "help", "run", "unused", "scaffold", "setup", "static", "version"]
}
