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

/** Configuration represents the configuration options for the textrun-shell library. */
export class Configuration {
  static default(): Configuration {
    return new Configuration({
      globals: {},
    })
  }

  /** Provides the configuration stored in the file with the given path. */
  static async load(filePath: string): Promise<Configuration> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fileText = await fs.readFile(filePath, "utf8")
      const content: ConfigFile = JSON.parse(fileText)
      return new Configuration(content)
    } catch (e) {
      return Configuration.default()
    }
  }

  /** contains the configuration settings read from the config file */
  file: ConfigFile

  constructor(file: ConfigFile) {
    this.file = file
  }

  /** provides the PathMapper instance to use */
  pathMapper(): PathMapper {
    return new PathMapper(this.file.globals)
  }
}
