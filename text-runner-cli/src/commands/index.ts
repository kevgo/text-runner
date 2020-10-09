export { instantiate } from "./instantiate"
export * from "./scaffold"

/** returns a list of all available commands */
export function names(): string[] {
  return ["debug", "dynamic", "help", "run", "unused", "scaffold", "setup", "static", "version"]
}
