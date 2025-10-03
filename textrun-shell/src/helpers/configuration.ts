import { PathMapper } from "./path-mapper.js"

/** PathMappings contains mappings of local to global executable paths. */
export interface PathMappings {
  readonly [name: string]: string
}

/** ConfigFile defines the structure of the configuration file for this Text-Runner plugin. */
interface ConfigFile {
  readonly globals: PathMappings
}

/** Configuration represents the configuration options for the textrun-shell library. */
export class Configuration {
  /** contains the configuration settings read from the config file */
  file: ConfigFile

  constructor(file: ConfigFile) {
    this.file = file
  }

  static default(): Configuration {
    return new Configuration({
      globals: {}
    })
  }

  /** Provides the configuration stored in the file with the given path. */
  static async load(filePath: string): Promise<Configuration> {
    try {
      const content = await import(filePath)
      // TODO: use the "debug" module to log this message under the "shell" namespace: `found path mapping at ${filePath}`
      const config: ConfigFile = content.default
      return new Configuration(config)
    } catch (e) {
      return Configuration.default()
    }
  }

  /** provides the PathMapper instance to use */
  pathMapper(): PathMapper {
    return new PathMapper(this.file.globals)
  }
}
