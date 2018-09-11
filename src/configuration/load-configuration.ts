import { CliArgTypes } from "../cli/cli-arg-types.js"
import { Configuration } from "./configuration.js"

import deb from "debug"
import camelCase from "just-camel-case"
import YAML from "yamljs"
import DetailedFormatter from "../formatters/detailed-formatter.js"
import getFormatterClass from "./get-formatter-class.js"
import Publications from "./publications.js"

const debug = deb("textrun:configuration")

const defaultValues: Configuration = {
  actions: {},
  classPrefix: "textrun",
  defaultFile: "",
  exclude: [],
  fileGlob: "**/*.md",
  keepTmp: false,
  publications: new Publications(),
  FormatterClass: DetailedFormatter,
  offline: false,
  sourceDir: process.cwd(),
  useSystemTempDirectory: false,
  workspace: "" // will be populated later
}

// Reads documentation and
export default function loadConfiguration(
  configFilePath: string,
  constructorArgs: CliArgTypes
): Configuration {
  let fileData: any = {}
  if (configFilePath) {
    debug(`loading configuration file: ${configFilePath}`)
    // $FlowFixMe: flow-type defs seems to be wrong here
    fileData = YAML.load(configFilePath) || {}
  }
  debug(`configuration file data: ${JSON.stringify(this.fileData)}`)

  function get(attributeName: string): string {
    const camelized = camelCase(attributeName)
    return (
      constructorArgs[attributeName] ||
      fileData[camelized] ||
      defaultValues[camelized]
    )
  }

  return {
    actions: fileData.actions ? fileData.actions : defaultValues.actions,
    classPrefix: get("class-prefix"),
    defaultFile: get("default-file"),
    exclude: get("exclude"),
    fileGlob: get("files") || defaultValues.fileGlob,
    keepTmp: String(get("keep-tmp")) === "true",
    FormatterClass: getFormatterClass(
      get("format"),
      defaultValues.FormatterClass
    ),
    publications:
      Publications.fromJSON(fileData.publications || []).sorted() ||
      defaultValues.publications,
    offline: String(get("offline")) === "true",
    sourceDir: get("source-dir"),
    useSystemTempDirectory: String(get("use-system-temp-directory")) === "true",
    workspace: get("workspace") || ""
  }
}
