import * as config from "./configuration"
import * as YAML from "yamljs"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

/** provides the config file content as a Configuration instance */
export async function load(cmdLineArgs: config.Data): Promise<config.Data> {
  return parse(await read(cmdLineArgs))
}

/** creates a new Text-Runner configuration file */
export async function create(cmdLineArgs: config.Data): Promise<void> {
  await fs.writeFile(
    path.join(cmdLineArgs.sourceDir || ".", cmdLineArgs.configFileName || "text-run.yml"),
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

/** provides the textual config file content */
async function read(cmdLineArgs: config.Data): Promise<string> {
  if (cmdLineArgs.configFileName) {
    const configFilePath = path.join(cmdLineArgs.sourceDir || ".", cmdLineArgs.configFileName)
    try {
      const result = await fs.readFile(configFilePath, "utf8")
      return result
    } catch (e) {
      throw new tr.UserError(`cannot read configuration file "${configFilePath}"`, e.message)
    }
  }
  try {
    const configFilePath = path.join(cmdLineArgs.sourceDir || ".", "text-run.yml")
    const result = await fs.readFile(configFilePath, "utf8")
    return result
  } catch (e) {
    return ""
  }
}

/** parses the textual config file content into a Configuration instance */
function parse(fileContent: string): config.Data {
  if (fileContent === "") {
    return new config.Data({})
  }
  const fileData = YAML.parse(fileContent)
  return new config.Data({
    regionMarker: fileData.regionMarker,
    defaultFile: fileData.defaultFile,
    emptyWorkspace: fileData.emptyWorkspace,
    exclude: fileData.exclude,
    files: fileData.files,
    formatterName: fileData.format,
    online: fileData.online,
    publications: fileData.publications,
    systemTmp: fileData.systemTmp,
    workspace: fileData.workspace,
  })
}
