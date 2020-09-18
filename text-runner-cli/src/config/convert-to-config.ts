import * as tr from "text-runner-core"
import { UserProvidedConfiguration } from "./user-provided-configuration"

export function convertToConfig(userConfig: UserProvidedConfiguration): tr.PartialConfiguration {
  const result: tr.PartialConfiguration = {}
  if (userConfig.defaultFile != null) {
    result.defaultFile = userConfig.defaultFile
  }
  if (userConfig.exclude != null) {
    result.exclude = userConfig.exclude
  }
  if (userConfig.files != null) {
    result.files = userConfig.files
  }
  if (userConfig.online != null) {
    result.online = userConfig.online
  }
  if (userConfig.publications != null) {
    result.publications = userConfig.publications
  }
  if (userConfig.regionMarker != null) {
    result.regionMarker = userConfig.regionMarker
  }
  if (userConfig.sourceDir != null) {
    result.sourceDir = userConfig.sourceDir
  }
  if (userConfig.systemTmp != null) {
    result.systemTmp = userConfig.systemTmp
  }
  if (userConfig.workspace != null) {
    result.workspace = userConfig.workspace
  }
  return result
}
