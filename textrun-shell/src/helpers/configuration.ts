import { promises as fs } from "fs"
import { PathMapper } from "./path-mapper"

/** ConfigFile defines the structure of the configuration file for this Text-Runner plugin. */
interface ConfigFile {
  readonly globals: PathMappings
}

/** PathMappings contains mappings of local to global executable paths. */
export interface PathMappings {
  readonly [name: string]: string
}

/** Configuration represents the configuration options for this Text-Runner library. */
export class Configuration {
  /** Provides the configuration stored in the file with the given path. */
  static async load(filePath: string): Promise<Configuration> {
    let rawContent: string = ""
    try {
      rawContent = await fs.readFile(filePath, "utf8")
    } catch (e) {
      return new Configuration({ globals: {} })
    }
    let jsonContent: any = {}
    try {
      jsonContent = JSON.parse(rawContent)
    } catch (e) {
      throw new Error(`File "${filePath} contains invalid JSON: ${e.message}`)
    }
    return new Configuration(jsonContent as ConfigFile)
  }

  file: ConfigFile

  constructor(file: ConfigFile) {
    this.file = file
  }

  pathMapper(): PathMapper {
    return new PathMapper(this.file.globals)
  }
}
