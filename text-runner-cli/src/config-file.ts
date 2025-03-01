import { promises as fs } from "fs"
import * as jsonc from "jsonc-reader"
import * as textRunner from "text-runner-core"

import * as config from "./configuration.js"

/** provides the config file content as a Configuration instance */
export async function load(cmdLineArgs: config.Data): Promise<config.Data> {
  return parse(await read(cmdLineArgs))
}

/** creates a new Text-Runner configuration file */
export async function create(cmdLineArgs: config.Data): Promise<void> {
  await fs.writeFile(
    cmdLineArgs.configFileName || "text-runner.jsonc",
    `{
  // link to the JSON schema that defines this document
  "$schema": "https://raw.githubusercontent.com/kevgo/text-runner/refs/heads/main/documentation/text-runner.schema.json",

  // white-list for files to test
  // This is a glob expression, see https://github.com/isaacs/node-glob#glob-primer
  // The folder "node_modules" is already excluded.
  // To exclude the "vendor" folder: '{,!(vendor)/**/}*.md'
  "files": "**/*.md",

  // black-list of files not to test
  // applied after the white-list above.
  "exclude": [],

  // the formatter to use (detailed, dot, progress, summary)
  "format": "detailed",

  // regex patterns for link targets to ignore
  "ignoreLinkTargets": [],

  // Define which folders of your Markdown source get compiled to HTML
  // and published under a different URL path.
  //
  // In this example, the public URL "/blog/foo"
  // would be hosted as "post/foo.md":
  // publications:
  //   - localPath: /posts/
  //     publicPath: /blog
  //     publicExtension: ''

  // Name of the default filename in folders.
  // If you set this, and a link points to a folder,
  // Text-Runner assumes the link points to the default file in that folder.
  // defaultFile: index.md

  // prefix that makes anchor tags active regions
  "regionMarker": "type",

  // whether to display/emit skipped activities
  "showSkipped": false,

  // whether to run the tests in an external temp directory,
  // uses ./tmp if false,
  // you can also provide a custom directory path here
  "systemTmp": false,

  // whether to verify online files/links (warning: this makes tests flaky)
  "online": false,

  // whether to delete all files in the workspace folder before running the tests
  "emptyWorkspace": true
}`
  )
}

/** provides the textual config file content */
async function read(cmdLineArgs: config.Data): Promise<string> {
  if (cmdLineArgs.configFileName) {
    try {
      const result = await fs.readFile(cmdLineArgs.configFileName, "utf8")
      return result
    } catch (e) {
      if (textRunner.isFsError(e)) {
        throw new textRunner.UserError(`cannot read configuration file "${cmdLineArgs.configFileName}"`, e.message)
      } else {
        throw e
      }
    }
  }
  try {
    const result = await fs.readFile("text-runner.jsonc", "utf8")
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
  const fileData = jsonc.parse(fileContent)
  return new config.Data({
    regionMarker: fileData.regionMarker,
    defaultFile: fileData.defaultFile,
    emptyWorkspace: fileData.emptyWorkspace,
    exclude: fileData.exclude,
    files: fileData.files,
    formatterName: fileData.format,
    ignoreLinkTargets: fileData.ignoreLinkTargets,
    online: fileData.online,
    publications: fileData.publications,
    showSkipped: fileData.showSkipped,
    systemTmp: fileData.systemTmp,
    workspace: fileData.workspace
  })
}
