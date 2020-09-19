import { Configuration } from "./user-provided-configuration"
import * as YAML from "yamljs"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

export class ConfigFile {
  private filename: string
  private sourceDir: string

  constructor(sourceDir: string, filename: string) {
    this.filename = filename
    this.sourceDir = sourceDir
  }

  static async fromCli(config: Configuration) {
    const file = new ConfigFile(config.sourceDir || ".", config.configFileName || "text-run.yml")
    return file.load()
  }

  /** provides the content of the config file in the standardized format */
  private async load(): Promise<Configuration> {
    const filename = await this.determineConfigFilename()
    if (!filename) {
      return new Configuration({})
    }
    const fileContent = await fs.readFile(filename, "utf-8")
    const fileData = YAML.parse(fileContent)
    return new Configuration({
      regionMarker: fileData.regionMarker,
      defaultFile: fileData.defaultFile,
      exclude: fileData.exclude,
      files: fileData.files,
      formatterName: fileData.format,
      online: fileData.online,
      publications: fileData.publications,
      systemTmp: fileData.systemTmp,
      workspace: fileData.workspace,
    })
  }

  async create() {
    await fs.writeFile(
      path.join(this.sourceDir, "./text-run.yml"),
      `# white-list for files to test
# This is a glob expression, see https://github.com/isaacs/node-glob#glob-primer
# The folder "node_modules" is already excluded.
# To exclude the "vendor" folder: '{,!(vendor)/**/}*.md'
files: "**/*.md"

# black-list of files not to test
# This is applied after the white-list above.
exclude: []

# the formatter to use (detailed, dot, progress, silent, summary)
format: detailed

# Define which folders of your Markdown source get compiled to HTML
# and published under a different URL path.
#
# In this example, the public URL "/blog/foo"
# is hosted as "post/foo.md":
# publications:
#   - localPath: /posts/
#     publicPath: /blog
#     publicExtension: ''

# Name of the default filename in folders.
# If this setting is given, and a link points to a folder,
# the link is assumed to point to the default file in that folder.
# defaultFile: index.md

# prefix that makes anchor tags active regions
regionMarker: type

# whether to run the tests in an external temp directory,
# uses ./tmp if false,
# you can also provide a custom directory path here
systemTmp: false

# whether to verify online files/links (warning: this makes tests flaky)
online: false`
    )
  }

  private static async determineConfigFilename(sourceDir: string, filename: string | undefined): Promise<string> {
    if (filename) {
      const configFilePath = path.join(sourceDir || ".", filename)
      try {
        await fs.stat(configFilePath)
        return configFilePath
      } catch (e) {
        throw new tr.UserError(`configuration file '${filename}' not found`)
      }
    }
    try {
      const configFilePath = path.join(sourceDir || ".", "text-run.yml")
      await fs.stat(configFilePath)
      return configFilePath
    } catch (e) {
      return ""
    }
  }
}
