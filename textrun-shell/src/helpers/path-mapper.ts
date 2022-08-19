import { PathMappings } from "./configuration.js"

/** Absolutifier makes  */
export class PathMapper {
  private mappings: PathMappings

  constructor(mappings: PathMappings) {
    this.mappings = mappings
  }

  globalizePathFunc(): (x: string) => string {
    return this.globalizePath.bind(this)
  }

  /** converts the given executable filename into its full path */
  private globalizePath(command: string): string {
    const words = command.split(" ")
    const hit = this.mappings[words[0]]
    if (!hit) {
      return command
    }
    words[0] = hit
    return words.join(" ")
  }
}
